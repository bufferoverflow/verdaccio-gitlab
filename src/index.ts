// Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT

import VerdaccioGitLab from './gitlab';
import { PluginOptions } from '@verdaccio/types';
import { VerdaccioGitlabConfig } from './gitlab';

export default function(config: VerdaccioGitlabConfig, options: PluginOptions<VerdaccioGitlabConfig>) {
  return new VerdaccioGitLab(config, options);
}
