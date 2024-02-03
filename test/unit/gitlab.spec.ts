import { Callback, RemoteUser } from '@verdaccio/types';
/* eslint-disable @typescript-eslint/no-unused-vars */
import Gitlab from 'gitlab';

import { VerdaccioGitlabPackageAccess } from '../../src/gitlab';
import VerdaccioGitlab from '../../src/gitlab';

import defaultConfig from './partials/config';

// Do not remove, this mocks the gitlab library

describe('Gitlab Auth Plugin Unit Tests', () => {
  let config;

  beforeEach(() => {
    config = {
      ...defaultConfig
    }
  })

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
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
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
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
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
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
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
      access: [],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
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
      name: undefined,
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@myGroup/myPackage',
      access: ['$authenticated'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
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
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
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
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
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
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_publish(config.remoteUser, _package, cb);
  });

  test('should allow publish of package based on user group with group name mapping and "nameMapping" strategy', done => {
    config.verdaccioGitlabConfig = {
      ...config.verdaccioGitlabConfig,
      groupSearchStrategy: 'nameMapping',
      groupsStrategy: {
        caseSensitive: true,
        searchPath: 'path',
        mappings: [
          { gitlabName: 'SubGroup1', packageJsonName: 'subGroup' }
        ]
      }
    };
    const userWithDifferentGroups: RemoteUser = {
      real_groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      name: config.remoteUser.name,
    };
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@subGroup/libName',
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_publish(userWithDifferentGroups, _package, cb);
  });

  test('should allow publish of package based on user group without group name mapping and "nameMapping" strategy', done => {
    config.verdaccioGitlabConfig = {
      ...config.verdaccioGitlabConfig,
      groupSearchStrategy: 'nameMapping',
      groupsStrategy: {
        caseSensitive: true,
        searchPath: 'path'
      }
    };
    const userWithDifferentGroups: RemoteUser = {
      real_groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      name: config.remoteUser.name,
    };
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@subGroup1/libName',
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_publish(userWithDifferentGroups, _package, cb);
  });

  test('should allow publish of package based on user group with package name mapping and "nameMapping" strategy', done => {
    config.verdaccioGitlabConfig = {
      ...config.verdaccioGitlabConfig,
      groupSearchStrategy: 'nameMapping',
      projectsStrategy: {
        caseSensitive: true,
        mappings: [
          { gitlabName: 'Lib.Name', packageJsonName: 'libName' }
        ]
      }
    };
    const userWithDifferentGroups: RemoteUser = {
      real_groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      name: config.remoteUser.name,
    };
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@subGroup/libName',
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_publish(userWithDifferentGroups, _package, cb);
  });

  test('should allow publish of package based on user group without package name mapping and "nameMapping" strategy', done => {
    config.verdaccioGitlabConfig = {
      ...config.verdaccioGitlabConfig,
      groupSearchStrategy: 'nameMapping',
      projectsStrategy: {
        caseSensitive: true
      }
    };
    const userWithDifferentGroups: RemoteUser = {
      real_groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      name: config.remoteUser.name,
    };
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@subGroup/lib.name',
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBe(true);
      done();
    };

    verdaccioGitlab.allow_publish(userWithDifferentGroups, _package, cb);
  });

  test('should deny publish of package based on unauthenticated', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const unauthenticatedUser: RemoteUser = {
      real_groups: [],
      groups: [],
      name: undefined,
    };
    const _package: VerdaccioGitlabPackageAccess = {
      name: config.user,
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
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
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(config.remoteUser, _package, cb);
  });

  test('should deny publish of package based on user group with package name mapping and "nameMapping" strategy', done => {
    config.verdaccioGitlabConfig = {
      ...config.verdaccioGitlabConfig,
      groupSearchStrategy: 'nameMapping',
      projectsStrategy: {
        caseSensitive: true,
        mappings: [
          { gitlabName: 'Lib.Name', packageJsonName: 'libName' }
        ]
      }
    };
    const userWithDifferentGroups: RemoteUser = {
      real_groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      name: config.remoteUser.name,
    };
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@subGroup2/libName2',
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(userWithDifferentGroups, _package, cb);
  });

  test('should deny publish of package based on user group without package name mapping and "nameMapping" strategy', done => {
    config.verdaccioGitlabConfig = {
      ...config.verdaccioGitlabConfig,
      groupSearchStrategy: 'nameMapping',
      projectsStrategy: {
        caseSensitive: true
      }
    };
    const userWithDifferentGroups: RemoteUser = {
      real_groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      name: config.remoteUser.name,
    };
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@subGroup2/lib.name2',
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(userWithDifferentGroups, _package, cb);
  });

  test('should deny publish of package based on user group with group name mapping and "nameMapping" strategy', done => {
    config.verdaccioGitlabConfig = {
      ...config.verdaccioGitlabConfig,
      groupSearchStrategy: 'nameMapping',
      groupsStrategy: {
        caseSensitive: true,
        searchPath: 'path',
        mappings: [
          { gitlabName: 'SubGroup1', packageJsonName: 'subGroup' }
        ]
      }
    };
    const userWithDifferentGroups: RemoteUser = {
      real_groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name',],
      name: config.remoteUser.name,
    };
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@subGroup2/libName2',
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(userWithDifferentGroups, _package, cb);
  });

  test('should deny publish of package based on user group without group name mapping and "nameMapping" strategy', done => {
    config.verdaccioGitlabConfig = {
      ...config.verdaccioGitlabConfig,
      groupSearchStrategy: 'nameMapping',
      groupsStrategy: {
        caseSensitive: true,
        searchPath: 'path'
      }
    };
    const userWithDifferentGroups: RemoteUser = {
      real_groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name2',],
      groups: ['Group1/SubGroup1', 'Group1/SubGroup1/Lib.Name2',],
      name: config.remoteUser.name,
    };
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: '@subGroup2/libName',
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(userWithDifferentGroups, _package, cb);
  });

  test('should deny publish of package based on user', done => {
    const verdaccioGitlab: VerdaccioGitlab = new VerdaccioGitlab(config.verdaccioGitlabConfig, config.options);
    const _package: VerdaccioGitlabPackageAccess = {
      name: 'anotherUser',
      access: ['$all'],
      gitlab: true,
      publish: ['$authenticated'],
      proxy: ['npmjs'],
    };

    const cb: Callback = (err, data) => {
      expect(err).toBeTruthy();
      expect(data).toBeFalsy();
      done();
    };

    verdaccioGitlab.allow_publish(config.remoteUser, _package, cb);
  });
});
