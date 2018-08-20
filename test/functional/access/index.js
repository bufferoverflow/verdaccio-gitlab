// @flow

import { CREDENTIALS, PACKAGE } from '../config.functional';
import { API_ERROR, HTTP_STATUS } from "../../lib/constants";


export default (server: any, gitlab: any) => { // eslint-disable-line no-unused-vars

  describe('package access tests', () => {
    beforeEach(() => {
      return server.auth(CREDENTIALS.user, CREDENTIALS.password);
    });

    test('should allow access to an existing proxied package', () => {
      return server.getPackage(PACKAGE.EXISTING_NAME)
        .status(HTTP_STATUS.OK)
        .then((body) => {
          expect(body).toHaveProperty('name');
          expect(body.name).toBe(PACKAGE.EXISTING_NAME);
        });
    });

    test('should fail with non-existing package', () => {
      return server.getPackage(PACKAGE.NON_EXISTING_NAME)
        .status(HTTP_STATUS.NOT_FOUND)
        .body_error(API_ERROR.NO_PACKAGE)
        .then((body) => {
          expect(body).toHaveProperty('error');
          expect(body.error).toMatch(/no/);
        });
    });
  });

}
