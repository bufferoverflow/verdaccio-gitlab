// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT
// @flow

import NodeCache from 'node-cache';
import type { Logger } from '@verdaccio/types';
import Crypto from 'crypto';

export class AuthCache {
  logger: Logger;
  ttl: number;
  storage: NodeCache;

  static get DEFAULT_TTL() { return 300; }

  constructor(logger: Logger, ttl: number) {
    this.logger = logger;
    this.ttl = ttl || AuthCache.DEFAULT_TTL;

    this.storage = new NodeCache({
      stdTTL: this.ttl,
      useClones: false
    });
    this.storage.on('expired', (key, value) => {
      if (this.logger.trace()) {
        this.logger.trace('[gitlab] expired key:', key, 'with value:', value);
      }
    });
  }

  findUser(username: string, password: string): UserData {
    return this.storage.get(this._generateKeyHash(username, password));
  }

  storeUser(username: string, password: string, userData: UserData): boolean {
    return this.storage.set(this._generateKeyHash(username, password), userData);
  }

  _generateKeyHash(username: string, password: string) {
    const sha = Crypto.createHash('sha256');
    sha.update(JSON.stringify({ username: username, password: password }));
    return sha.digest('hex');
  }

}

export class UserData {
  _username: string;
  _groups: string[];

  get username(): string { return this._username; }
  get groups(): string[] { return this._groups; }
  set groups(groups: string[]) { this._groups = groups; }

  constructor(username: string, groups: string[]) {
    this._username = username;
    this._groups = groups;
  }
}
