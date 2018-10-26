// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT
// @flow

import type { Callback, IPluginAuth, Logger, PluginOptions, RemoteUser, PackageAccess } from '@verdaccio/types';
import type { UserDataGroups } from './authcache';

import Gitlab from 'gitlab';
import { AuthCache, UserData } from './authcache';
import httperror from 'http-errors';

export type VerdaccioGitlabAccessLevel =
  '$guest' |
  '$reporter' |
  '$developer' |
  '$maintainer' |
  '$owner';

export type VerdaccioGitlabConfig = {
  url: string,
  authCache?: {
    enabled?: boolean,
    ttl?: number
  },
  legacy_mode?: boolean,
  publish?: VerdaccioGitlabAccessLevel
};

export type VerdaccioGitlabPackageAccess = PackageAccess & {
  name: string,
  gitlab?: boolean
}

const ACCESS_LEVEL_MAPPING = {
  $guest: 10,
  $reporter: 20,
  $developer: 30,
  $maintainer: 40,
  $owner: 50
};

export default class VerdaccioGitLab implements IPluginAuth {
  options: PluginOptions;
  config: VerdaccioGitlabConfig;
  authCache: AuthCache;
  logger: Logger;
  publishLevel: VerdaccioGitlabAccessLevel;

  constructor(config: VerdaccioGitlabConfig, options: PluginOptions) {
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

    if (this.config.legacy_mode) {
      this.publishLevel = '$owner';
      this.logger.info('[gitlab] legacy mode pre-gitlab v11.2 active, publish is only allowed to group owners');
    } else {
      this.publishLevel = '$maintainer';
      if (this.config.publish) {
        this.publishLevel = this.config.publish;
      }

      if (!Object.keys(ACCESS_LEVEL_MAPPING).includes(this.publishLevel)) {
        throw Error(`[gitlab] invalid publish access level configuration: ${this.publishLevel}`);
      }
      this.logger.info(`[gitlab] publish control level: ${this.publishLevel}`);
    }
  }

  authenticate(user: string, password: string, cb: Callback) {
    this.logger.trace(`[gitlab] authenticate called for user: ${user}`);

    // Try to find the user groups in the cache
    const cachedUserGroups = this._getCachedUserGroups(user, password);
    if (cachedUserGroups) {
      this.logger.debug(`[gitlab] user: ${user} found in cache, authenticated with groups:`, cachedUserGroups);
      return cb(null, cachedUserGroups.publish);
    }

    // Not found in cache, query gitlab
    this.logger.trace(`[gitlab] user: ${user} not found in cache`);

    const GitlabAPI = new Gitlab({
      url: this.config.url,
      token: password
    });

    const pUsers = GitlabAPI.Users.current();
    return pUsers.then(response => {
      if (user !== response.username) {
        return cb(httperror[401]('wrong gitlab username'));
      }

      const publishLevelId = ACCESS_LEVEL_MAPPING[this.publishLevel];
      const userGroups = {
        publish: [user]
      };

      // Set the groups of an authenticated user, in normal mode:
      // - for access, depending on the package settings in verdaccio
      // - for publish, the logged in user id and all the groups they can reach as configured with access level `$auth.gitlab.publish`
      //
      // In legacy mode, the groups are:
      // - for access, depending on the package settings in verdaccio
      // - for publish, the logged in user id and all the groups they can reach as `$owner`
      const gitlabPublishQueryParams = this.config.legacy_mode ? { owned: true } : { min_access_level: publishLevelId };
      const pPublishGroups = GitlabAPI.Groups.all(gitlabPublishQueryParams).then(groups => {
        this.logger.trace('[gitlab] querying gitlab user groups with params:', gitlabPublishQueryParams);
        this._addGroupsToArray(groups, userGroups.publish);
      }).catch(error => {
        this.logger.error(`[gitlab] user: ${user} error querying publish groups: ${error}`);
        return cb(httperror[500]('error querying gitlab'));
      });

      const pGroups = Promise.all([pPublishGroups]);
      return pGroups.then(() => {
        this._setCachedUserGroups(user, password, userGroups);
        this.logger.info(`[gitlab] user: ${user} successfully authenticated`);
        this.logger.debug(`[gitlab] user: ${user}, with groups:`, userGroups);
        return cb(null, userGroups.publish);
      }).catch(error => {
        this.logger.error(`[gitlab] error authenticating: ${error}`);
        return cb(httperror[500]('error authenticating'));
      });
    }).catch(error => {
      this.logger.info(`[gitlab] user: ${user} error authenticating: ${error.message || {}}`);
      if (error) {
        return cb(httperror[401]('personal access token invalid'));
      }
    });
  }

  adduser(user: string, password: string, cb: Callback) {
    this.logger.trace(`[gitlab] adduser called for user: ${user}`);
    return cb(null, true);
  }

  allow_access(user: RemoteUser, _package: VerdaccioGitlabPackageAccess, cb: Callback) {
    if (!_package.gitlab) return cb();

    if ((_package.access || []).includes('$authenticated') && user.name !== undefined) {
      this.logger.debug(`[gitlab] allow user: ${user.name} access to package: ${_package.name}`);
      return cb(null, true);
    } else if ((_package.access || []).includes('$all')) {
      this.logger.debug(`[gitlab] allow unauthenticated access to package: ${_package.name}`);
      return cb(null, true);
    } else {
      this.logger.debug(`[gitlab] deny user: ${user.name || '<empty>'} access to package: ${_package.name}`);
      return cb(httperror[401]('access denied, user not authenticated in gitlab and unauthenticated package access disabled'));
    }
  }

  allow_publish(user: RemoteUser, _package: VerdaccioGitlabPackageAccess, cb: Callback) {
    if (!_package.gitlab) return cb();
    let packageScopePermit = false;
    let packagePermit = false;
    // Only allow to publish packages when:
    //  - the package has exactly the same name as one of the user groups, or
    //  - the package scope is the same as one of the user groups
    for (let real_group of user.real_groups) { // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      this.logger.trace(`[gitlab] publish: checking group: ${real_group} for user: ${user.name || ''} and package: ${_package.name}`);
      if (real_group === _package.name) {
        packagePermit = true;
        break;
      } else if (_package.name.indexOf('@') === 0 && real_group === _package.name.slice(1, _package.name.lastIndexOf('/'))) {
        packageScopePermit = true;
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

  _getCachedUserGroups(username: string, password: string): ?UserDataGroups {
    if (!this.authCache) {
      return null;
    }
    const userData = this.authCache.findUser(username, password);
    return (userData || {}).groups || null;
  }

  _setCachedUserGroups(username: string, password: string, groups: UserDataGroups): boolean {
    if (!this.authCache) {
      return false;
    }
    this.logger.debug(`[gitlab] saving data in cache for user: ${username}`);
    return this.authCache.storeUser(username, password, new UserData(username, groups));
  }

  _addGroupsToArray(src: {path: string, full_path: string}[], dst: string[]) {
    src.forEach(group => {
      if (group.path === group.full_path) {
        dst.push(group.path);
      }
    });
  }
}
