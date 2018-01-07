// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT
var request = require('request');
var async = require('async');
const httperror = require('http-errors');
function Auth(config, stuff) {
  var self = Object.create(Auth.prototype);
  self._users = {};
  self._config = config;
  self._logger = stuff.logger;

  return self;
}

module.exports = Auth;

Auth.prototype.authenticate = function(user, password, cb) {

  var params = {
    url: this._config.url + '/api/v4/user',
    method: 'get',
    headers: {
      'Private-Token': password
    }
  };
  request(params, function(error, response, body) {
    if (error) return cb(error);
    if (response.statusCode < 200 || response.statusCode >= 300) return cb('Invalid status code ' + response.statusCode);
    console.log(JSON.parse(body));
    console.log(JSON.parse(body).username);
    if (user !== JSON.parse(body).username) return cb(httperror[403]('wrong gitlab username'));
    cb(null, ['group1', 'group2']);
  });
};
