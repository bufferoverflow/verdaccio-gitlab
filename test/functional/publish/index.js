// @flow

import { CREDENTIALS, PACKAGE, WRONG_CREDENTIALS } from '../config.functional';
import { HTTP_STATUS } from "../../lib/constants";


export default (server: any, gitlab: any) => { // eslint-disable-line no-unused-vars

  describe('package publish tests', () => {
    beforeEach(() => {
      return server.auth(CREDENTIALS.user, CREDENTIALS.password);
    });

    test('should deny publish of package when unauthenticated', () => {
      return server.auth(WRONG_CREDENTIALS.user, CREDENTIALS.password)
        .then(() => {
            return server.putPackage(PACKAGE.NAME, require('../fixtures/package')(PACKAGE.NAME))
              .status(HTTP_STATUS.FORBIDDEN)
              .then((body) => {
                expect(body).toHaveProperty('error');
              });
        });
    });

    test('should allow publish of package when gitlab groups match', () => {
      return server.putPackage(PACKAGE.NAME, require('../fixtures/package')(PACKAGE.NAME))
        .status(HTTP_STATUS.CREATED)
        .body_ok(/created new package/)
        .then((body) => {
          expect(body).toHaveProperty('ok');
          expect(body.ok).toMatch(/created/);
          expect(body).toHaveProperty('success');
          expect(body.success).toBe(true);
        });
    });
  });
}
