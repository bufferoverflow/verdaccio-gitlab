// @flow

import type { IServerBridge } from '../types';

import basic from './basic';
import auth from './auth';
import access from './access';
import publish from './publish';


describe('Functional Tests verdaccio-gitlab', () => {
  jest.setTimeout(10000);
  const server1: IServerBridge = global.__SERVERS__[0];
  const gitlab = global.__GITLAB_SERVER__.app;

  // list of tests
  // note: order of the following calls is important
  basic(server1, gitlab);
  auth(server1, gitlab);
  access(server1, gitlab);
  publish(server1, gitlab);
});

process.on('unhandledRejection', (err) => {
  console.error("unhandledRejection", err);
  process.nextTick(() => {
    throw err;
  });
});
