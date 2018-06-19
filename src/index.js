// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT
import GitLab from './gitlab';

/**
 * A new instance of HTPasswd class.
 * @param {object} config
 * @param {object} stuff
 * @returns {object}
 */
export default function(config, stuff) {
  return new GitLab(config, stuff);
}
