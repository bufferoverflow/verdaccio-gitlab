// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT

import Crypto from 'crypto';

import {Logger} from '@verdaccio/types';
import NodeCache from 'node-cache';

export class GitlabCache {
  private logger: Logger;
  private ttl: number;
  private storage: NodeCache;

  public static readonly DEFAULT_TTL = 300;

  private static _generateKeyHash(username: string, password: string) {
    const sha = Crypto.createHash('sha256');
    sha.update(JSON.stringify({ username, password }));
    return sha.digest('hex');
  }

  public constructor(logger: Logger, ttl?: number) {
    this.logger = logger;
    this.ttl = ttl || GitlabCache.DEFAULT_TTL;

    this.storage = new NodeCache({
      stdTTL: this.ttl,
      useClones: false,
    });
    this.storage.on('expired', (key, value) => {
      this.logger.trace(`[gitlab] expired key: ${key} with value:`, value);
    });
  }

  public getPromise(username: string, password: string, type: 'user' | 'groups' | 'projects'): Promise<any> {
    return this.storage.get(GitlabCache._generateKeyHash(`${username}_${type}_promise`, password)) as Promise<any>;
  }

  public storePromise(username: string, password: string, type: 'user' | 'groups' | 'projects', promise: Promise<any>): boolean {
    return this.storage.set(GitlabCache._generateKeyHash(`${username}_${type}_promise`, password), promise);
  }
}
