// @flow

import type { Callback, RemoteUser } from '@verdaccio/types';
import type { VerdaccioGitlabPackageAccess } from "../../src/gitlab";

import VerdaccioGitlab from '../../src/gitlab.js';
import config from './partials/config';

// Do not remove, this mocks the gitlab library
import Gitlab from 'gitlab'; // eslint-disable-line no-unused-vars



describe('Gitlab Auth Plugin Unit Tests', () => {
  test('should create a plugin instance', () => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);

    expect(verdaccioGitlab).toBeDefined();
  });

  test('should authenticate a user', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data.sort()).toEqual(['myGroup', 'anotherGroup/myProject', 'myUser'].sort());
      done();
    };

    verdaccioGitlab.authenticate(config.user, config.pass, cb);
  });

  test('should fail authentication with wrong pass', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const wrongPass: string = config.pass + '_wrong';

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.authenticate(config.user, wrongPass, cb);
  });

  test('should fail authentication with non-existing user', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const wrongUser: string = config.user + '_wrong';

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.authenticate(wrongUser, config.pass, cb);
  });

  test('should allow access to package based on user group', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@myGroup/myPackage',
      access: ['$authenticated'],
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      // false allows the plugin chain to continue
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_access(config.remoteUser, _package, cb);
  });

  test('should allow access to package based on user project', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@anotherGroup/myProject',
      access: ['$authenticated'],
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      // false allows the plugin chain to continue
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_access(config.remoteUser, _package, cb);
  });

  test('should allow access to package based on user name', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: config.user,
      access: ['$authenticated'],
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      // false allows the plugin chain to continue
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_access(config.remoteUser, _package, cb);
  });

  test('should allow access to package when access level is empty (default = $all)', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: config.user,
      access: undefined,
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      // false allows the plugin chain to continue
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_access(config.remoteUser, _package, cb);
  });

  test('should deny access to package based on unauthenticated', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
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
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@myGroup/myPackage',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_publish(config.remoteUser, _package, cb);
  });

  test('should allow publish of package based on user project', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@anotherGroup/myProject',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_publish(config.remoteUser, _package, cb);
  });

  test('should allow publish of package based on user name', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: config.user,
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_publish(config.remoteUser, _package, cb);
  });

  test('should deny publish of package based on unauthenticated', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const unauthenticatedUser: RemoteUser = {
      real_groups: [],
      groups: [],
      name: undefined
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: config.user,
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
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@anotherGroup/myPackage',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(config.remoteUser, _package, cb);
  });

  test('should deny publish of package based on user', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: 'anotherUser',
      gitlab: true
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(config.remoteUser, _package, cb);
  });
});
