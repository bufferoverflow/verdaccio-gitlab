// @flow

import type { UserDataGroups } from '../../src/authcache.js';

import { AuthCache, UserData } from '../../src/authcache.js';
import logger from './partials/logger.js';


const TEST_USER: string = 'myUser';
const TEST_PASS: string = 'myPass';
const TEST_DATA_GROUPS: UserDataGroups = {
  publish: ['fooGroup1', 'fooGroup2']
};
const TEST_USER_DATA: UserData = new UserData(TEST_USER, TEST_DATA_GROUPS);


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

    authCache.storeUser(TEST_USER, TEST_PASS, TEST_USER_DATA);
    const returnedData: UserData = authCache.findUser(TEST_USER, TEST_PASS);

    expect(returnedData).toEqual(TEST_USER_DATA);
  });

  test('should store and find some user data when ttl is unlimited', () => {
    const UNLIMITED_TTL: number = 0;
    const authCache: AuthCache = new AuthCache(logger, UNLIMITED_TTL);

    authCache.storeUser(TEST_USER, TEST_PASS, TEST_USER_DATA);
    const returnedData: UserData = authCache.findUser(TEST_USER, TEST_PASS);

    expect(returnedData).toEqual(TEST_USER_DATA);
  });
});
