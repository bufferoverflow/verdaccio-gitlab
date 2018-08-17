// @flow

import type { Callback, RemoteUser } from '@verdaccio/types';
import type { VerdaccioGitlabPackageAccess } from "../../src/gitlab";

import VerdaccioGitlab from '../../src/gitlab.js';
import { defaultConfig } from './partials/config.js';
import logger from './partials/logger.js';

// Do not remove, this mocks the gitlab library
import Gitlab from 'gitlab'; // eslint-disable-line no-unused-vars


const TEST_OPTIONS = {
  // $FlowFixMe
  config:  {},
  logger: logger
};
const TEST_USER: string = 'myUser';
const TEST_PASS: string = 'myPass';
const TEST_REMOTE_USER: RemoteUser = {
  real_groups: ['myGroup', TEST_USER],
  groups: ['myGroup', TEST_USER],
  name: TEST_USER
};


describe('Gitlab Auth Plugin Unit Tests', () => {
  test('should create a plugin instance', () => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);

    expect(verdaccioGitlab).toBeDefined();
  });

  test('should authenticate a user', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data.sort()).toEqual(['myGroup', 'myUser'].sort());
      done();
    };

    verdaccioGitlab.authenticate(TEST_USER, TEST_PASS, cb);
  });

  test('should fail authentication with wrong pass', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);
    const wrongPass: string = TEST_PASS + '_wrong';

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.authenticate(TEST_USER, wrongPass, cb);
  });

  test('should fail authentication with non-existing user', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);
    const wrongUser: string = TEST_USER + '_wrong';

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.authenticate(wrongUser, TEST_PASS, cb);
  });

  test('should allow access to package based on user group', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);
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

    verdaccioGitlab.allow_access(TEST_REMOTE_USER, _package, cb);
  });

  test('should allow access to package based on user name', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);
    const _package: VerdaccioGitlabPackageAccess = {
      name: TEST_USER,
      access: ['$authenticated'],
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_access(TEST_REMOTE_USER, _package, cb);
  });

  test('should deny access to package based on unauthenticated', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);
    const unauthenticatedUser: RemoteUser = {
      real_groups: [],
      groups: [],
      name: undefined
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@myGroup/myPackage',
      access: ['$authenticated'],
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_access(unauthenticatedUser, _package, cb);
  });

  test('should allow publish of package based on user group', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@myGroup/myPackage',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(false);
      done();
    };

    verdaccioGitlab.allow_publish(TEST_REMOTE_USER, _package, cb);
  });

  test('should allow publish of package based on user name', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);
    const _package: VerdaccioGitlabPackageAccess = {
      name: TEST_USER,
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(false);
      done();
    };

    verdaccioGitlab.allow_publish(TEST_REMOTE_USER, _package, cb);
  });

  test('should deny publish of package based on unauthenticated', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);
    const unauthenticatedUser: RemoteUser = {
      real_groups: [],
      groups: [],
      name: undefined
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: TEST_USER,
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(unauthenticatedUser, _package, cb);
  });

  test('should deny publish of package based on group', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@anotherGroup/myPackage',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(TEST_REMOTE_USER, _package, cb);
  });

  test('should deny publish of package based on user', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(defaultConfig, TEST_OPTIONS);
    const _package: VerdaccioGitlabPackageAccess = {
      name: 'anotherUser',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(TEST_REMOTE_USER, _package, cb);
  });
});
