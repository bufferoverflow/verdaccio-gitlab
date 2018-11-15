// @flow

import whoAmI from './whoami';
import ping from './ping';


export default (server: any, gitlab: any) => { // eslint-disable-line no-unused-vars

  describe('basic test endpoints', () => {
    whoAmI(server);
    ping(server);
  });

}
