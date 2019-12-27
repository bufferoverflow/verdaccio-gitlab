// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT

import Crypto from 'crypto';

import { Logger } from '@verdaccio/types';
import NodeCache from 'node-cache';

export class AuthCache {
  private logger: Logger;
  private ttl: number;
  private storage: NodeCache;

  public static get DEFAULT_TTL() {
    return 300;
  }

  private static _generateKeyHash(username: string, password: string) {
    const sha = Crypto.createHash('sha256');
    sha.update(JSON.stringify({ username: username, password: password }));
    return sha.digest('hex');
  }

  public constructor(logger: Logger, ttl?: number) {
    this.logger = logger;
    this.ttl = ttl || AuthCache.DEFAULT_TTL;

    this.storage = new NodeCache({
      stdTTL: this.ttl,
      useClones: false,
    });
    this.storage.on('expired', (key, value) => {
      this.logger.trace(`[gitlab] expired key: ${key} with value:`, value);
    });
  }

  public findUser(username: string, password: string): UserData {
    return this.storage.get(AuthCache._generateKeyHash(username, password)) as UserData;
  }

  public storeUser(username: string, password: string, userData: UserData): boolean {
    return this.storage.set(AuthCache._generateKeyHash(username, password), userData);
  }
}

export type UserDataGroups = {
  publish: string[];
};

export class UserData {
  private _username: string;
  private _groups: UserDataGroups;

  public get username(): string {
    return this._username;
  }
  public get groups(): UserDataGroups {
    return this._groups;
  }
  public set groups(groups: UserDataGroups) {
    this._groups = groups;
  }

  public constructor(username: string, groups: UserDataGroups) {
    this._username = username;
    this._groups = groups;
  }
}
