// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// Version
// SPDX-License-Identifier: MIT

import { Callback, IPluginAuth, Logger, PluginOptions, RemoteUser, PackageAccess } from '@verdaccio/types';
import { getInternalError, getUnauthorized, getForbidden } from '@verdaccio/commons-api';
import { Gitlab } from 'gitlab';

import groupSearchStrategies from './groupSearchStrategies';
import { UserDataGroups } from './authcache';
import { AuthCache, UserData } from './authcache';

export type VerdaccioGitlabAccessLevel = '$guest' | '$reporter' | '$developer' | '$maintainer' | '$owner';

export type VerdaccioGitlabNameMapping = {
  gitlabName: string,
  packageJsonName: string
};

export type VerdaccioGitLabStrategy = {
  caseSensitive?: boolean,
  searchPath?: string,
  mappings?: VerdaccioGitlabNameMapping[]
};

export type VerdaccioGitlabConfig = {
  url: string;
  authCache?: {
    enabled?: boolean;
    ttl?: number;
  };
  publish?: VerdaccioGitlabAccessLevel;
  groupsStrategy?: VerdaccioGitLabStrategy; // only available on groupSearchStrategy 'nameMapping'
  projectsStrategy?: VerdaccioGitLabStrategy; // only available on groupSearchStrategy 'nameMapping'
  groupSearchStrategy?: 'default' | 'nameMapping';
};

export interface VerdaccioGitlabPackageAccess extends PackageAccess {
  name?: string;
  gitlab?: boolean;
}

const ACCESS_LEVEL_MAPPING = {
  $guest: 10,
  $reporter: 20,
  $developer: 30,
  $maintainer: 40,
  $owner: 50,
};

// List of verdaccio builtin levels that map to anonymous access
const BUILTIN_ACCESS_LEVEL_ANONYMOUS = ['$anonymous', '$all'];

// Level to apply on 'allow_access' calls when a package definition does not define one
const DEFAULT_ALLOW_ACCESS_LEVEL = ['$all'];

export default class VerdaccioGitLab implements IPluginAuth<VerdaccioGitlabConfig> {
  private options: PluginOptions<VerdaccioGitlabConfig>;
  private config: VerdaccioGitlabConfig;
  private authCache?: AuthCache;
  private logger: Logger;
  private publishLevel: VerdaccioGitlabAccessLevel;

  public constructor(config: VerdaccioGitlabConfig, options: PluginOptions<VerdaccioGitlabConfig>) {
    this.logger = options.logger;
    this.config = config;
    this.options = options;
    this.logger.info(`[gitlab] url: ${this.config.url}`);

    if ((this.config.authCache || {}).enabled === false) {
      this.logger.info('[gitlab] auth cache disabled');
    } else {
      const ttl = (this.config.authCache || {}).ttl || AuthCache.DEFAULT_TTL;
      this.authCache = new AuthCache(this.logger, ttl);
      this.logger.info(`[gitlab] initialized auth cache with ttl: ${ttl} seconds`);
    }

    this.publishLevel = '$maintainer';
    if (this.config.publish) {
      this.publishLevel = this.config.publish;
    }

    if (!Object.keys(ACCESS_LEVEL_MAPPING).includes(this.publishLevel)) {
      throw Error(`[gitlab] invalid publish access level configuration: ${this.publishLevel}`);
    }
    this.logger.info(`[gitlab] publish control level: ${this.publishLevel}`);
  }

  public authenticate(user: string, password: string, cb: Callback) {
    this.logger.trace(`[gitlab] authenticate called for user: ${user}`);

    // Try to find the user groups in the cache
    const cachedUserGroups = this._getCachedUserGroups(user, password);
    if (cachedUserGroups) {
      this.logger.debug(`[gitlab] user: ${user} found in cache, authenticated with groups:`, cachedUserGroups.toString());
      return cb(null, cachedUserGroups.publish);
    }

    // Not found in cache, query gitlab
    this.logger.trace(`[gitlab] user: ${user} not found in cache`);

    const GitlabAPI = new Gitlab({
      host: this.config.url,
      token: password,
    });

    GitlabAPI.Users.current()
      .then(response => {
        if (user.toLowerCase() !== response['username']?.toLowerCase()) {
          return cb(getUnauthorized('wrong gitlab username'));
        }

        const publishLevelId = ACCESS_LEVEL_MAPPING[this.publishLevel];

        // Set the groups of an authenticated user, in normal mode:
        // - for access, depending on the package settings in verdaccio
        // - for publish, the logged in user id and all the groups they can reach as configured with access level `$auth.gitlab.publish`
        const gitlabPublishQueryParams = { min_access_level: publishLevelId };

        this.logger.trace('[gitlab] querying gitlab user groups with params:', gitlabPublishQueryParams.toString());

        const groupSearchPath = this.config.groupsStrategy?.searchPath ?? 'path';
        const projectSearchPath = this.config.projectsStrategy?.searchPath ?? 'path_with_namespace';

        const groupsPromise = GitlabAPI.Groups.all(gitlabPublishQueryParams).then(groups => {
          return groups.filter(group => group.path === group.full_path || this.config.groupsStrategy).map(group =>
            this.config.groupsStrategy?.caseSensitive
              ? group[groupSearchPath]?.toLowerCase() ?? ''
              : group[groupSearchPath] ?? ''
          );
        });

        const projectsPromise = GitlabAPI.Projects.all(gitlabPublishQueryParams).then(projects => {
          return projects.map(project =>
            this.config.projectsStrategy?.caseSensitive
              ? project[projectSearchPath].toLowerCase() ?? ''
              : project[projectSearchPath] ?? ''
            );
        });

        Promise.all([groupsPromise, projectsPromise])
          .then(([groups, projectGroups]) => {
            const realGroups = [user, ...groups, ...projectGroups];
            this._setCachedUserGroups(user, password, { publish: realGroups });

            this.logger.info(`[gitlab] user: ${user} successfully authenticated`);
            this.logger.debug(`[gitlab] user: ${user}, with groups:`, realGroups.toString());

            return cb(null, realGroups);
          })
          .catch(error => {
            this.logger.error(`[gitlab] user: ${user} error querying gitlab: ${error}`);
            return cb(getUnauthorized('error authenticating user'));
          });
      })
      .catch(error => {
        this.logger.error(`[gitlab] user: ${user} error querying gitlab user data: ${error.message || {}}`);
        return cb(getUnauthorized('error authenticating user'));
      });
  }

  public adduser(user: string, password: string, cb: Callback) {
    this.logger.trace(`[gitlab] adduser called for user: ${user}`);
    return cb(null, true);
  }

  public changePassword(user: string, password: string, newPassword: string, cb: Callback) {
    this.logger.trace(`[gitlab] changePassword called for user: ${user}`);
    return cb(getInternalError('You are using verdaccio-gitlab integration. Please change your password in gitlab'));
  }

  public allow_access(user: RemoteUser, _package: VerdaccioGitlabPackageAccess & PackageAccess, cb: Callback) {
    if (!_package.gitlab) return cb(null, false);

    const packageAccess = _package.access && _package.access.length > 0 ? _package.access : DEFAULT_ALLOW_ACCESS_LEVEL;

    if (user.name !== undefined) {
      // successfully authenticated
      this.logger.debug(`[gitlab] allow user: ${user.name} authenticated access to package: ${_package.name}`);
      return cb(null, true);
    } else {
      // unauthenticated
      if (BUILTIN_ACCESS_LEVEL_ANONYMOUS.some(level => packageAccess.includes(level))) {
        this.logger.debug(`[gitlab] allow anonymous access to package: ${_package.name}`);
        return cb(null, true);
      } else {
        this.logger.debug(`[gitlab] deny access to package: ${_package.name}`);
        return cb(getUnauthorized('access denied, user not authenticated and anonymous access disabled'));
      }
    }
  }

  public allow_publish(user: RemoteUser, _package: VerdaccioGitlabPackageAccess & PackageAccess, cb: Callback) {
    if (!_package.gitlab) return cb(null, false);

    const packageScopePermit = false;
    let packagePermit = false;
    // Only allow to publish packages when:
    //  - the package has exactly the same name as one of the user groups, or
    //  - the package scope is the same as one of the user groups
    for (const real_group of user.real_groups) {
      // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      this.logger.info(
        `[gitlab] publish: checking group: ${real_group} for user: ${user.name || ''} and package: ${_package.name}`
      );

      if (this._matchGroupWithPackage(real_group, _package.name as string)) {
        packagePermit = true;
        break;
      }
    }

    if (packagePermit || packageScopePermit) {
      const perm = packagePermit ? 'package-name' : 'package-scope';
      this.logger.debug(
        `[gitlab] user: ${user.name || ''} allowed to publish package: ${_package.name} based on ${perm}`
      );
      return cb(null, true);
    } else {
      this.logger.debug(`[gitlab] user: ${user.name || ''} denied from publishing package: ${_package.name}`);
      // @ts-ignore
      const missingPerm = _package.name.indexOf('@') === 0 ? 'package-scope' : 'package-name';
      return cb(getForbidden(`must have required permissions: ${this.publishLevel || ''} at ${missingPerm}`));
    }
  }

  private _matchGroupWithPackage(real_group: string, package_name: string): boolean {
    if (real_group === package_name) {
      return true;
    }

    if (package_name.indexOf('@') === 0) {
      const split_real_group = real_group.split('/');
      const split_package_name = package_name.slice(1).split('/');

      return groupSearchStrategies[this.config.groupSearchStrategy ?? 'default'](split_real_group, split_package_name, this.config);
    }

    return false;
  }

  private _getCachedUserGroups(username: string, password: string): UserDataGroups | null {
    if (!this.authCache) {
      return null;
    }
    const userData = this.authCache.findUser(username, password);
    return (userData || {}).groups || null;
  }

  private _setCachedUserGroups(username: string, password: string, groups: UserDataGroups): boolean {
    if (!this.authCache) {
      return false;
    }
    this.logger.debug(`[gitlab] saving data in cache for user: ${username}`);
    return this.authCache.storeUser(username, password, new UserData(username, groups));
  }
}
