import { AuthCache, UserData } from '../../src/authcache';

import logger from './partials/logger';
import config from './partials/config';

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

    authCache.storeUser(config.user, config.pass, config.userData);
    const returnedData: UserData = authCache.findUser(config.user, config.pass);

    expect(returnedData).toEqual(config.userData);
  });

  test('should store and find some user data when ttl is unlimited', () => {
    const UNLIMITED_TTL = 0;
    const authCache: AuthCache = new AuthCache(logger, UNLIMITED_TTL);

    authCache.storeUser(config.user, config.pass, config.userData);
    const returnedData: UserData = authCache.findUser(config.user, config.pass);

    expect(returnedData).toEqual(config.userData);
  });
});
