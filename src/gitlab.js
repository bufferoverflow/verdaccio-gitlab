// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT
// @flow

import Gitlab from 'gitlab';
import { AuthCache, UserData } from './authcache';
import httperror from 'http-errors';
import type { Callback, Config, IPluginAuth, Logger, PluginOptions, RemoteUser, PackageAccess } from '@verdaccio/types';

export type VerdaccioGitlabConfig = Config & {
  url: string,
  authCache?: {
    enabled?: boolean,
    ttl?: number
  }
};

type VerdaccioGitlabPackageAccess = PackageAccess & {
  name: string,
  gitlab?: boolean
}

export default class VerdaccioGitLab implements IPluginAuth {
  options: PluginOptions;
  config: VerdaccioGitlabConfig;
  authCache: AuthCache;
  logger: Logger;

  constructor(
    config: VerdaccioGitlabConfig,
    options: PluginOptions
  ) {
    this.logger = options.logger;

    this.config = config;
    this.options = options;

    this.logger.info(`[gitlab] gitlab url: ${this.config.url}`);

    if ((this.config.authCache || {}).enabled === false) {
      this.logger.info('[gitlab] auth cache disabled');
    } else {
      const ttl = (this.config.authCache || {}).ttl || AuthCache.DEFAULT_TTL;
      this.authCache = new AuthCache(this.logger, ttl);

      this.logger.info(`[gitlab] initialized auth cache with ttl: ${ttl} seconds`);
    }

  }

  authenticate(user: string, password: string, cb: Callback) {
    this.logger.trace(`[gitlab] authenticate called for user: ${user}`);

    // Try to find the user groups in the cache
    const cachedUserGroups = this._getCachedUserGroups(user, password);

    if (cachedUserGroups) {
      this.logger.debug(`[gitlab] user: ${user} found in cache, authenticated with groups: ${cachedUserGroups.toString()}`);
      return cb(null, cachedUserGroups);
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

      // Set the groups of an authenticated user to themselves and all gitlab projects of which they are an owner
      let ownedGroups = [user];
      GitlabAPI.Groups.all({owned: true}).then(groups => {
        for (let group of groups) {
          if (group.path === group.full_path) {
            ownedGroups.push(group.path);
          }
        }

        // Store found groups in cache
        this._setCachedUserGroups(user, password, ownedGroups);
        this.logger.trace(`[gitlab] saving data in cache for user: ${user}`);

        this.logger.info(`[gitlab] user: ${user} authenticated`);
        this.logger.debug(`[gitlab] user: ${user} authenticated, with groups: ${ownedGroups.toString()}`);
        return cb(null, ownedGroups);
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
    if (!_package.gitlab) { return cb(); }
    if ((_package.access || []).includes('$authenticated') && user.name !== undefined) {
      this.logger.debug(`[gitlab] allow user: ${user.name} access to package: ${_package.name}`);
      return cb(null, true);
    } else if (! (_package.access || []).includes('$authenticated')) {
      this.logger.debug(`[gitlab] allow unauthenticated access to package: ${_package.name}`);
      return cb(null, true);
    } else {
      this.logger.debug(`[gitlab] deny user: ${user.name || ''} access to package: ${_package.name}`);
      return cb(null, false);
    }
  }

  allow_publish(user: RemoteUser, _package: VerdaccioGitlabPackageAccess, cb: Callback) {
    if (!_package.gitlab) { return cb(); }
    let packageScopeOwner = false;
    let packageOwner = false;

    // Only allow to publish packages when:
    //  - the package has exactly the same name as one of the user groups, or
    //  - the package scope is the same as one of the user groups
    for (let real_group of user.real_groups) { // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      this.logger.trace(`[gitlab] publish: checking group: ${real_group} for user: ${user.name || ''} and package: ${_package.name}`);
      if (real_group === _package.name) {
        packageOwner = true;
        break;
      } else {
        if (_package.name.indexOf('@') === 0) {
          if (real_group === _package.name.slice(1, _package.name.lastIndexOf('/'))) {
            packageScopeOwner = true;
            break;
          }
        }
      }
    }

    if (packageOwner === true) {
      this.logger.debug(`[gitlab] user: ${user.name || ''} allowed to publish package: ${_package.name} as owner of package-name`);
      return cb(null, false);
    } else {
      if (packageScopeOwner === true) {
        this.logger.debug(`[gitlab] user: ${user.name || ''} allowed to publish package: ${_package.name} as owner of package-scope`);
        return cb(null, false);
      } else {
        this.logger.debug(`[gitlab] user: ${user.name || ''} denied from publishing package: ${_package.name}`);
        if (_package.name.indexOf('@') === 0) {
          return cb(httperror[403]('must be owner of package-scope'));
        } else {
          return cb(httperror[403]('must be owner of package-name'));
        }
      }
    }
  }

  _getCachedUserGroups(username: string, password: string): ?string[] {
    if (! this.authCache) {
      return null;
    }
    const userData = this.authCache.findUser(username, password);
    return (userData || {}).groups || null;
  }

  _setCachedUserGroups(username: string, password: string, groups: string[]): boolean {
    return this.authCache && this.authCache.storeUser(username, password, new UserData(username, groups));
  }
}
