// @flow

import _ from 'lodash';
import { createHash } from 'crypto';


export const defaultTarballHashAlgorithm = 'sha1';

export const buildToken = (type: string, token: string) => {
  return `${_.capitalize(type)} ${token}`;
}

export function createTarballHash() {
  return createHash(defaultTarballHashAlgorithm);
}

