// @flow

import { createHash } from 'crypto';

import _ from 'lodash';

export const defaultTarballHashAlgorithm = 'sha1';

export const buildToken = (type: string, token: string) => {
  return `${_.capitalize(type)} ${token}`;
};

export function createTarballHash() {
  return createHash(defaultTarballHashAlgorithm);
}
