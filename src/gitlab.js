// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT
// @flow

import Gitlab from 'gitlab';
import httperror from 'http-errors';
import type { PackageAccess, Config, Logger, Callback } from '@verdaccio/types';

export default class VerdaccioGitLab {
  users: {};
  stuff: {};
  config: {};
  logger: Logger;

  constructor(
    config: {
      url: string
    },
    stuff: {
      [config: string]: {
        users_file: string,
        self_path: string
      }
    }
  ) {
    this.users = {};

    this.config = config;
    this.stuff = stuff;

    this.logger = stuff.logger;

  }

  authenticate(user: string, password: string, cb: Callback) {
    this.logger.trace('[gitlab] authenticate called for user:', user);

    const GitlabAPI = new Gitlab({
      url:   this.config.url,
      token: password
    });

    GitlabAPI.Users.current().then(response => {
      if (user !== response.username) { return cb(httperror[401]('wrong gitlab username')); }

      // Set the groups of an authenticated user to themselves and all gitlab projects of which they are an owner
      let ownedGroups = [user];
      GitlabAPI.Groups.all({'owned': 'true'}).then(groups => {
        for (let group of groups) {
          if (group.path === group.full_path) {
            ownedGroups.push(group.path);
          }
        }

        this.logger.debug('[gitlab] user:', user, 'authenticated, with groups:', ownedGroups);
        cb(null, ownedGroups);
      });
    }).
    catch(error => {
      this.logger.debug('[gitlab] error authenticating:', error.error || null);
      if (error) { return cb(httperror[401]('personal access token invalid')); }
    });
  }

  adduser(user: string, password: string, cb: Callback) {
    this.logger.trace('[gitlab] adduser called for user:', user);
    cb(null, true);
  }

  allow_access(user, _package: PackageAccess, cb: Callback) {
    if (!_package.gitlab) { return cb(); }
    if (_package.access.includes('$authenticated') && user.name !== undefined) {
      this.logger.debug('[gitlab] allow user:', user.name, 'access to package:', _package.name);
      return cb(null, true);
    } else {
      this.logger.debug('[gitlab] pass-through unauthenticated access package:', _package.name);
      return cb(null, false);
    }
  }

  allow_publish(user, _package: PackageAccess, cb: Callback) { // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
    if (!_package.gitlab) { return cb(); }
    let packageScopeOwner = false;
    let packageOwner = false;

    // Only allow to publish packages when:
    //  - the package has exactly the same name as one of the user groups, or
    //  - the package scope is the same as one of the user groups
    for (let real_group of user.real_groups) { // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
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
      this.logger.debug('[gitlab] user:', user.name, 'allowed to publish package:', _package.name, 'as owner of package-name');
      return cb(null, false);
    } else {
      if (packageScopeOwner === true) {
        this.logger.debug('[gitlab] user:', user.name, 'allowed to publish package:', _package.name, 'as owner of package-scope');
        return cb(null, false);
      } else {
        this.logger.debug('[gitlab] user:', user.name, 'denied from publishing package:', _package.name);
        if (_package.name.indexOf('@') === 0) {
          return cb(httperror[403]('must be owner of package-scope'));
        } else {
          return cb(httperror[403]('must be owner of package-name'));
        }
      }
    }
  }
}
