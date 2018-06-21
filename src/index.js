// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT
import VerdaccioGitLab from './gitlab';

export default function(config, stuff) {
  return new VerdaccioGitLab(config, stuff);
}
