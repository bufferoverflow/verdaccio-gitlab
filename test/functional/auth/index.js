// @flow

import { CREDENTIALS, WRONG_CREDENTIALS } from '../config.functional';
import { HTTP_STATUS } from "../../lib/constants";

export default (server: any, gitlab: any) => { // eslint-disable-line no-unused-vars

  describe('authentication tests', () => {
    test('should authenticate user', () => {
      return server.auth(CREDENTIALS.user, CREDENTIALS.password)
        .status(HTTP_STATUS.CREATED)
        .body_ok(new RegExp(CREDENTIALS.user))
        .then((body) => {
          expect(body).toHaveProperty('ok');
          expect(body).toHaveProperty('token');
        });
    });

    test('should fail authentication with wrong user', () => {
      return server.auth(WRONG_CREDENTIALS.user, CREDENTIALS.password)
        .status(HTTP_STATUS.UNAUTHORIZED)
        .then((body) => {
          expect(body).toHaveProperty('error');
          expect(body.error).toMatch(/wrong/);
        });
    });

    test('should fail authentication with wrong password', () => {
      return server.auth(CREDENTIALS.user, WRONG_CREDENTIALS.password)
        .status(HTTP_STATUS.UNAUTHORIZED)
        .then((body) => {
          expect(body).toHaveProperty('error');
          expect(body.error).toMatch(/error/);
        });
    });
  });

}
