// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT
// @flow

import type { Logger } from '@verdaccio/types';

import Crypto from 'crypto';
import NodeCache from 'node-cache';

export class AuthCache {
  logger: Logger;
  ttl: number;
  storage: NodeCache;

  static get DEFAULT_TTL() { return 300; }

  static _generateKeyHash(username: string) {
    const sha = Crypto.createHash('sha256');
    sha.update(JSON.stringify({ username: username }));
    return sha.digest('hex');
  }

  constructor(logger: Logger, ttl?: number) {
    this.logger = logger;
    this.ttl = ttl <= 0 ? AuthCache.DEFAULT_TTL : ttl || AuthCache.DEFAULT_TTL;

    this.storage = new NodeCache({
      stdTTL: this.ttl,
      useClones: false
    });
    this.storage.on('expired', (key, value) => {
      if (this.logger.trace()) {
        this.logger.trace(`[gitlab] expired key: ${key} with value:`, value);
      }
    });
  }

  findUser(username: string): UserData {
    return this.storage.get(AuthCache._generateKeyHash(username));
  }

  storeUser(username: string, userData: UserData): boolean {
    return this.storage.set(AuthCache._generateKeyHash(username), userData);
  }
}

export type UserDataGroups = {
  publish: Array<string>,
  access: Array<string>
};

export class UserData {
  _username: string;
  _groups: UserDataGroups;

  get username(): string { return this._username; }
  get groups(): UserDataGroups { return this._groups; }
  set groups(groups: UserDataGroups) { this._groups = groups; }

  constructor(username: string, groups: UserDataGroups) {
    this._username = username;
    this._groups = groups;
  }
}
