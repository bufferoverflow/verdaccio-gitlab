// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT

var httperror = require('http-errors');

function Auth(config, stuff) {
  var self = Object.create(Auth.prototype);
  self._users = {};
  self._config = config;
  self._logger = stuff.logger;
  return self;
}

module.exports = Auth;

Auth.prototype.authenticate = function(user, password, cb) {

  var GitlabAPI = require('node-gitlab-api')({
    url:   this._config.url,
    token: password
  });

  GitlabAPI.users.current().then((response) => {
    if (user !== response.body.username) return cb(httperror[403]('wrong gitlab username'));
    GitlabAPI.groups.all({'owned': 'true'}).then((groups) => {
      var ownedGroups = [];
      groups.forEach(function(item) {
        if (item.path === item.full_path) { // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
          ownedGroups.push(item.path);
        }
      });
      cb(null, ownedGroups);
    });
  }).
  catch(error => {
    if (error) return cb('Personal access token invalid');
  });
};
