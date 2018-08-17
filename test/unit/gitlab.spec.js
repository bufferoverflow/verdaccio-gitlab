// @flow

import type { Callback, RemoteUser } from '@verdaccio/types';
import type { VerdaccioGitlabPackageAccess } from "../../src/gitlab";

import VerdaccioGitlab from '../../src/gitlab.js';
import { defaultConfig } from './partials/config.js';
import logger from './partials/logger.js';

// Do not remove, this mocks the gitlab library
import Gitlab from 'gitlab'; // eslint-disable-line no-unused-vars
const options = {
  // $FlowFixMe
  config:  {},
  logger: logger
};

describe('Gitlab Auth Plugin Unit Tests', () => {
  test('should create a plugin instance', () => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, options);

    expect(verdaccioGitlab).toBeDefined();
  });

  test('should authenticate a user', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, options);
    const user: string = 'myUser';
    const pass: string = 'myPass';

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data.sort()).toEqual(['myGroup', 'myUser'].sort());
      done();
    };

    verdaccioGitlab.authenticate(user, pass, cb);
  });

  test('should fail authentication with wrong pass', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, options);
    const user: string = 'myUser';
    const pass: string = 'anotherPass';

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.authenticate(user, pass, cb);
  });

  test('should fail authentication with not existing user', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, options);
    const user: string = 'anotherUser';
    const pass: string = 'myPass';

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.authenticate(user, pass, cb);
  });

  test('should allow access to package based on user group', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, options);
    const user: RemoteUser = {
      real_groups: ['myGroup', 'myUser'],
      groups: ['myGroup', 'myUser'],
      name: 'myUser'
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@myGroup/myPackage',
      access: ['$authenticated'],
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_access(user, _package, cb);
  });

  test('should allow access to package based on user name', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, options);
    const user: RemoteUser = {
      real_groups: ['myGroup', 'myUser'],
      groups: ['myGroup', 'myUser'],
      name: 'myUser'
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: 'myUser',
      access: ['$authenticated'],
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_access(user, _package, cb);
  });

  test('should allow publish of package based on user group', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, options);
    const user: RemoteUser = {
      real_groups: ['myGroup', 'myUser'],
      groups: ['myGroup', 'myUser'],
      name: 'myUser'
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@myGroup/myPackage',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(false);
      done();
    };

    verdaccioGitlab.allow_publish(user, _package, cb);
  });

  test('should allow publish of package based on user name', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, options);
    const user: RemoteUser = {
      real_groups: ['myGroup', 'myUser'],
      groups: ['myGroup', 'myUser'],
      name: 'myUser'
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: 'myUser',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(false);
      done();
    };

    verdaccioGitlab.allow_publish(user, _package, cb);
  });

  test('should deny publish of package based on unauthenticated', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, options);
    const user: RemoteUser = {
      real_groups: [],
      groups: [],
      name: undefined
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: 'myUser',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(user, _package, cb);
  });

  test('should deny publish of package based on group', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, options);
    const user: RemoteUser = {
      real_groups: ['myGroup', 'myUser'],
      groups: ['myGroup', 'myUser'],
      name: 'myUser'
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@anotherGroup/myPackage',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(user, _package, cb);
  });

  test('should deny publish of package based on user', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, options);
    const user: RemoteUser = {
      real_groups: ['myGroup', 'myUser'],
      groups: ['myGroup', 'myUser'],
      name: 'myUser'
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: 'anotherUser',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(user, _package, cb);
  });
});
