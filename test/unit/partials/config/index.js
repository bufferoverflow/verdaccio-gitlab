//@flow

import type { PluginOptions, RemoteUser } from '@verdaccio/types';
import type { VerdaccioGitlabConfig } from '../../../../src/gitlab.js';
import type { UserDataGroups } from '../../../../src/authcache.js';

import logger from '../logger.js';
import { UserData } from '../../../../src/authcache.js';


const verdaccioGitlabConfig: VerdaccioGitlabConfig = {
  url: 'myUrl'
};

const options: PluginOptions = {
  // $FlowFixMe
  config:  {},
  logger: logger
};

const user: string = 'myUser';
const pass: string = 'myPass';
const remoteUser: RemoteUser = {
  real_groups: ['myGroup', 'anotherGroup/myProject', user],
  groups: ['myGroup', 'anotherGroup/myProject', user],
  name: user
};

const userDataGroups: UserDataGroups = {
  publish: ['fooGroup1', 'fooGroup2']
};
const userData: UserData = new UserData(user, userDataGroups);

const config = {
  verdaccioGitlabConfig: verdaccioGitlabConfig,
  options: options,
  user: user,
  pass: pass,
  remoteUser: remoteUser,
  userData: userData
}

export default config;
