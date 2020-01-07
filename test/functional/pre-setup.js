require('@babel/register')({
  extensions: ['.ts', '.js']
});

import { blue } from 'kleur';

module.exports = async () => {
  console.log(blue('setup: starting servers'));
  require('./lib/setup');
}