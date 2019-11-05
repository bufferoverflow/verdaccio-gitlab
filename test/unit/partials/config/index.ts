
import { PluginOptions, RemoteUser } from '@verdaccio/types';
import { VerdaccioGitlabConfig } from '../../../../src/gitlab';
import { UserDataGroups } from '../../../../src/authcache';

import logger from '../logger';
import { UserData } from '../../../../src/authcache';


const verdaccioGitlabConfig: VerdaccioGitlabConfig = {
  url: 'myUrl'
};

const options: PluginOptions<VerdaccioGitlabConfig> = {
  //@ts-ignore
  config:  {},
  //@ts-ignore
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
