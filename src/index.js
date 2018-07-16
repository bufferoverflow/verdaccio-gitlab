// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT
// @flow

import VerdaccioGitLab from './gitlab';
import type { PluginOptions } from '@verdaccio/types';
import type { VerdaccioGitlabConfig } from './gitlab';

export default function(config: VerdaccioGitlabConfig, options: PluginOptions) {
  return new VerdaccioGitLab(config, options);
}
