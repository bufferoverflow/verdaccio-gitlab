// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT
// @flow

import Gitlab from 'gitlab';
import {httperror} from 'http-errors';
import type {Config, Logger, Callback} from '@verdaccio/types';

export default class GitLab {
  /**
   *
   * @param {*} config 
   * @param {object} stuff config.yaml in object from
   */

  // flow types
  users: {};
  stuff: {};
  config: Config;
  logger: Logger;

  // constructor
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

    // config for this module
    this.config = config;
    this.stuff = stuff;

    // verdaccio logger
    this.logger = stuff.logger;

  }

authenticate(user: string, password: string, cb: Callback) {

  var GitlabAPI = new Gitlab({
    url:   this.config.url,
    token: password
  });

  GitlabAPI.Users.current().then((response) => {
    if (user !== response.username) return cb(httperror[403]('wrong gitlab username'));
    var ownedGroups = [user];
    GitlabAPI.Groups.all({'owned': 'true'}).then((groups) => {
      groups.forEach(function(item) {
        if (item.path === item.full_path) {
          ownedGroups.push(item.path);
        }
      });
      cb(null, ownedGroups);
    });
  }).
  catch(error => {
    if (error) return cb('Personal access token invalid');
  });
}

adduser(user: string, password: string, cb: Callback) {
  cb(null, false);
}

allow_access(user: string, _package: string , cb: Callback) {
  if (!_package.gitlab) return cb();
  if (_package.access.includes('$authenticated') && user.name !== undefined) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
}

allow_publish(user: string, _package: string, cb: Callback) { // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  if (!_package.gitlab) return cb();
  var packageScopeOwner = false;
  var packageOwner = false;

  user.real_groups.forEach(function(item) { // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
    if (item === _package.name) {
      packageOwner = true;
      return false;
    } else {
      if (_package.name.indexOf('@') === 0) {
        if (item === _package.name.slice(1, _package.name.lastIndexOf('/'))) {
          packageScopeOwner = true;
          return false;
        }
      }
    }
  });

  if (packageOwner === true) {
    return cb(null, false);
  } else {
    if (packageScopeOwner === true) {
      return cb(null, false);
    } else {
      if (_package.name.indexOf('@') === 0) {
        return cb(httperror[403]('must be owner of package-scope'));
      } else {
        return cb(httperror[403]('must be owner of package-name'));
      }
    }
  }
}

}
