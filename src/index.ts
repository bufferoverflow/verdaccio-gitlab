// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT

import { PluginOptions } from '@verdaccio/types';

import VerdaccioGitLab from './gitlab';
import { VerdaccioGitlabConfig } from './gitlab';

export default function(config: VerdaccioGitlabConfig, options: PluginOptions<VerdaccioGitlabConfig>) {
  return new VerdaccioGitLab(config, options);
}
