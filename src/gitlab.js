// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT
// @flow

import type { Callback, IPluginAuth, Logger, PluginOptions, RemoteUser, PackageAccess } from '@verdaccio/types';
import type { UserDataGroups } from './authcache';

import Gitlab from 'gitlab';
import { AuthCache, UserData } from './authcache';
import httperror from 'http-errors';
import { normalizeYamlSetting } from './utils';

export type VerdaccioGitlabAccessLevel =
  '$guest' |
  '$reporter' |
  '$developer' |
  '$maintainer' |
  '$owner';

export type VerdaccioGitlabConfig = {
  url: string,
  authCache?: {
    ttl?: number
  },
  legacy_mode?: boolean,
  access?: VerdaccioGitlabAccessLevel,
  publish?: VerdaccioGitlabAccessLevel
};

export type VerdaccioGitlabPackageAccess = PackageAccess & {
  name: string,
  gitlab?: boolean,
  gitlabUserGroupWhitelist?: any
}

const ACCESS_LEVEL_MAPPING = {
  $guest: 10,
  $reporter: 20,
  $developer: 30,
  $maintainer: 40,
  $owner: 50
};

// List of verdaccio builtin levels that map to anonymous access
const BUILTIN_ACCESS_LEVEL_ANONYMOUS = [ '$anonymous', '$all' ];

// Level to apply on 'allow_access' calls when a package definition does not define one
const DEFAULT_ALLOW_ACCESS_LEVEL = [ '$all' ];


export default class VerdaccioGitLab implements IPluginAuth {
  options: PluginOptions;
  config: VerdaccioGitlabConfig;
  authCache: AuthCache;
  logger: Logger;
  accessLevel: VerdaccioGitlabAccessLevel;
  publishLevel: VerdaccioGitlabAccessLevel;

  constructor(config: VerdaccioGitlabConfig, options: PluginOptions) {
    this.logger = options.logger;
    this.config = config;
    this.options = options;
    this.logger.info(`[gitlab] url: ${this.config.url}`);

    const ttl = (this.config.authCache || {}).ttl || AuthCache.DEFAULT_TTL;
    this.authCache = new AuthCache(this.logger, ttl);
    this.logger.info(`[gitlab] initialized auth cache with ttl: ${ttl} seconds`);

    if (this.config.legacy_mode) {
      this.publishLevel = '$owner';
      this.logger.info('[gitlab] legacy mode pre-gitlab v11.2 active, publish is only allowed to group owners');
    } else {
      if (this.config.publish) {
        this.publishLevel = this.config.publish;
      } else {
        this.publishLevel = '$maintainer';
      }

      if (this.config.access) {
        this.accessLevel = this.config.access;
      } else {
        this.accessLevel = '$maintainer';
      }

      if (!Object.keys(ACCESS_LEVEL_MAPPING).includes(this.accessLevel)) {
        throw Error(`[gitlab] invalid access access level configuration: ${this.accessLevel}`);
      }
      if (!Object.keys(ACCESS_LEVEL_MAPPING).includes(this.publishLevel)) {
        throw Error(`[gitlab] invalid publish access level configuration: ${this.publishLevel}`);
      }
      this.logger.info(`[gitlab] access control level: ${this.accessLevel}`);
      this.logger.info(`[gitlab] publish control level: ${this.publishLevel}`);
    }
  }

  authenticate(user: string, password: string, cb: Callback) {
    this.logger.trace(`[gitlab] authenticate called for user: ${user}`);

    // Try to find the user groups in the cache
    const cachedUserGroups = this._getCachedUserGroups(user, password);
    if (cachedUserGroups) {
      this.logger.debug(`[gitlab] user: ${user} found in cache, authenticated with groups:`, cachedUserGroups);
      return cb(null, [user]);
    }

    // Not found in cache, query gitlab
    this.logger.trace(`[gitlab] user: ${user} not found in cache`);

    const GitlabAPI = new Gitlab({
      url: this.config.url,
      token: password
    });

    GitlabAPI.Users.current().then(response => {
      if (user !== response.username) {
        return cb(httperror[401]('wrong gitlab username'));
      }

      const publishLevelId = ACCESS_LEVEL_MAPPING[this.publishLevel];
      const accessLevelId = ACCESS_LEVEL_MAPPING[this.accessLevel];

      // Set the groups of an authenticated user, in normal mode:
      // - for access, depending on the package settings in verdaccio
      // - for publish, the logged in user id and all the groups they can reach as configured with access level `$auth.gitlab.publish`
      //
      // In legacy mode, the groups are:
      // - for access, depending on the package settings in verdaccio
      // - for publish, the logged in user id and all the groups they can reach as fixed `$auth.gitlab.publish` = `$owner`
      const gitlabAccessQueryParams = this.config.legacy_mode ? { owned: true } : { min_access_level: accessLevelId };
      const gitlabPublishQueryParams = this.config.legacy_mode ? { owned: true } : { min_access_level: publishLevelId };
      this.logger.trace('[gitlab] querying gitlab user groups with params:', gitlabPublishQueryParams);

      const accessGroupsPromise = GitlabAPI.Groups.all(gitlabAccessQueryParams).then(groups => {
        return groups.filter(group => group.path === group.full_path).map(group => group.path);
      });
      const publishGroupsPromise = GitlabAPI.Groups.all(gitlabPublishQueryParams).then(groups => {
        return groups.filter(group => group.path === group.full_path).map(group => group.path);
      });

      const accessProjectsPromise = GitlabAPI.Projects.all(gitlabAccessQueryParams).then(projects => {
        return projects.map(project => project.path_with_namespace);
      });
      const publishProjectsPromise = GitlabAPI.Projects.all(gitlabPublishQueryParams).then(projects => {
        return projects.map(project => project.path_with_namespace);
      });

      Promise.all([accessGroupsPromise, publishGroupsPromise, accessProjectsPromise, publishProjectsPromise]).then(([accessGroups, publishGroups, accessProjectGroups, publishProjectGroups]) => {
        const realAccessGroups = [user, ...accessGroups, ...accessProjectGroups];
        const realPublishGroups = [user, ...publishGroups, ...publishProjectGroups];
        this._setCachedUserGroups(user, {access: realAccessGroups, publish: realPublishGroups});

        this.logger.info(`[gitlab] user: ${user} successfully authenticated`);
        this.logger.debug(`[gitlab] user: ${user}, with groups:`, realPublishGroups);

        // The actual implementation of Verdaccio's plugin does not allow us to differentiate access and publish at this point.
        // We'll use the cache to bypass that for now. For that reason, it does not matter what groups we return here.
        return cb(null, [user]);
      }).catch(error => {
        this.logger.error(`[gitlab] user: ${user} error querying gitlab: ${error}`);
        return cb(httperror[401]('error authenticating user'));
      });

    }).catch(error => {
      this.logger.error(`[gitlab] user: ${user} error querying gitlab user data: ${error.message || {}}`);
      return cb(httperror[401]('error authenticating user'));
    });
  }

  adduser(user: string, password: string, cb: Callback) {
    this.logger.trace(`[gitlab] adduser called for user: ${user}`);
    return cb(null, true);
  }

  allow_access(user: RemoteUser, _package: VerdaccioGitlabPackageAccess, cb: Callback) {
    if (!_package.gitlab) return cb(null, false);

    const packageAccess = (_package.access && _package.access.length > 0) ? _package.access : DEFAULT_ALLOW_ACCESS_LEVEL;

    if (user.name !== undefined) { // successfully authenticated

      if (_package.gitlabUserGroupWhitelist) {
        const cachedUserGroups = this._getCachedUserGroups(user.name);
        if (!cachedUserGroups) {
          this.logger.debug(`[gitlab] no user found in cache for this username: ${user.name}`);
          return cb(httperror[401]('access denied, user found'));
        }

        let userGroups = cachedUserGroups.access;

        this.logger.trace(`[gitlab] access: checking group whitelist for user: ${user.name || ''} and package: ${_package.name}`);

        const gitlabUserGroupWhitelist = normalizeYamlSetting(_package.gitlabUserGroupWhitelist);

        for (let whitelistedGroup of gitlabUserGroupWhitelist) {
          if (userGroups.indexOf(whitelistedGroup) !== -1) {
            this.logger.debug(`[gitlab] user: ${user.name || ''} allowed to access package: ${_package.name} based on group whitelist ${whitelistedGroup}`);
            return cb(null, true);
          }
        }

        this.logger.debug(`[gitlab] deny access to package: ${_package.name}`);
        return cb(httperror[401]('access denied, user is not member of any of the whitelisted groups'));
      } else {
        this.logger.debug(`[gitlab] allow user: ${user.name} authenticated access to package: ${_package.name}`);
        return cb(null, true);
      }
    } else { // unauthenticated
      if (BUILTIN_ACCESS_LEVEL_ANONYMOUS.some(level => packageAccess.includes(level))) {
        this.logger.debug(`[gitlab] allow anonymous access to package: ${_package.name}`);
        return cb(null, true);
      } else {
        this.logger.debug(`[gitlab] deny access to package: ${_package.name}`);
        return cb(httperror[401]('access denied, user not authenticated and anonymous access disabled'));
      }
    }
  }

  allow_publish(user: RemoteUser, _package: VerdaccioGitlabPackageAccess, cb: Callback) {
    if (!_package.gitlab) return cb(null, false);

    if (_package.gitlabUserGroupWhitelist) {
      const cachedUserGroups = this._getCachedUserGroups(user.name);
      if (!cachedUserGroups) {
        this.logger.debug(`[gitlab] no user found in cache for this username: ${user.name}`);
        return cb(httperror[401]('publish denied, user found'));
      }

      let userGroups = cachedUserGroups.publish;

      this.logger.trace(`[gitlab] publish: checking group whitelist for user: ${user.name || ''} and package: ${_package.name}`);

      const gitlabUserGroupWhitelist = normalizeYamlSetting(_package.gitlabUserGroupWhitelist);

      for (let whitelistedGroup of gitlabUserGroupWhitelist) {
        if (userGroups.indexOf(whitelistedGroup) !== -1) {
          this.logger.debug(`[gitlab] user: ${user.name || ''} allowed to publish package: ${_package.name} based on group whitelist ${whitelistedGroup}`);
          return cb(null, true);
        }
      }

      this.logger.debug(`[gitlab] deny publish to package: ${_package.name}`);
      return cb(httperror[401]('publish denied, user is not member of any of the whitelisted groups'));
    }
    
    let packageScopePermit = false;
    let packagePermit = false;
    // Only allow to publish packages when:
    //  - the package has exactly the same name as one of the user groups, or
    //  - the package scope is the same as one of the user groups
    for (let real_group of user.real_groups) { // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      this.logger.trace(`[gitlab] publish: checking group: ${real_group} for user: ${user.name || ''} and package: ${_package.name}`);

      if (this._matchGroupWithPackage(real_group, _package.name)) {
        packagePermit = true;
        break;
      }
    }

    if (packagePermit || packageScopePermit) {
      const perm = packagePermit ? 'package-name' : 'package-scope';
      this.logger.debug(`[gitlab] user: ${user.name || ''} allowed to publish package: ${_package.name} based on ${perm}`);
      return cb(null, true);
    } else {
      this.logger.debug(`[gitlab] user: ${user.name || ''} denied from publishing package: ${_package.name}`);
      const missingPerm = _package.name.indexOf('@') === 0 ? 'package-scope' : 'package-name';
      return cb(httperror[403](`must have required permissions: ${this.config.publish || ''} at ${missingPerm}`));
    }
  }

  _matchGroupWithPackage(real_group: string, package_name: string): boolean {
    if (real_group === package_name) {
      return true
    }

    if (package_name.indexOf('@') === 0) {
      const split_real_group = real_group.split('/');
      const split_package_name = package_name.slice(1).split('/');

      if (split_real_group.length > split_package_name.length) {
        return false;
      }

      for (let i = 0; i < split_real_group.length; i += 1) {
        if (split_real_group[i] !== split_package_name[i]) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  _getCachedUserGroups(username: string): ?UserDataGroups {
    const userData = this.authCache.findUser(username);
    return (userData || {}).groups || null;
  }

  _setCachedUserGroups(username: string, groups: UserDataGroups): boolean {
    this.logger.debug(`[gitlab] saving data in cache for user: ${username}`);
    return this.authCache.storeUser(username, new UserData(username, groups));
  }
}
