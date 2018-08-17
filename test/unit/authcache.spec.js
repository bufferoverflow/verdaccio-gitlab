// @flow

import type { Logger } from '@verdaccio/types';
import type { UserDataGroups } from '../../src/authcache.js';

import { AuthCache, UserData } from '../../src/authcache.js';


const logger: Logger = {
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  child: jest.fn(),
  warn: jest.fn(),
  http: jest.fn(),
  trace: jest.fn()
};

describe('AuthCache Unit Tests', () => {
  test('should create an AuthCache instance', () => {
    const authCache: AuthCache = new AuthCache(logger, AuthCache.DEFAULT_TTL);

    expect(authCache).toBeTruthy();
  });

  test('should create an AuthCache instance with default ttl', () => {
    const authCache: AuthCache = new AuthCache(logger);

    expect(authCache).toBeTruthy();
    expect(authCache).toHaveProperty('ttl', AuthCache.DEFAULT_TTL);
  });

  test('should store and find some user data', () => {
    const authCache: AuthCache = new AuthCache(logger);
    const user: string = 'fooUser';
    const pass: string = 'fooPass';
    const dataGroups: UserDataGroups = {
      publish: ['fooGroup1', 'fooGroup2']
    };
    const data: UserData = new UserData(user, dataGroups);

    authCache.storeUser(user, pass, data);
    const returnedData: UserData = authCache.findUser(user, pass);

    expect(returnedData).toEqual(data);
  });

  test('should store and find some user data when ttl is unlimited', () => {
    const UNLIMITED_TTL: number = 0;
    const authCache: AuthCache = new AuthCache(logger, UNLIMITED_TTL);
    const user: string = 'fooUser';
    const pass: string = 'fooPass';
    const dataGroups: UserDataGroups = {
      publish: ['fooGroup1', 'fooGroup2']
    };
    const data: UserData = new UserData(user, dataGroups);

    authCache.storeUser(user, pass, data);
    const returnedData: UserData = authCache.findUser(user, pass);

    expect(returnedData).toEqual(data);
  });
});
