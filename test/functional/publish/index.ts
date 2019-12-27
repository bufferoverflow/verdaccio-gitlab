import { CREDENTIALS, PACKAGE, WRONG_CREDENTIALS } from '../config.functional';
import { HTTP_STATUS } from '../../lib/constants';
import fixturePkg from '../fixtures/package';

export default (server: any, gitlab: any) => {
  describe('package publish tests', () => {
    beforeEach(() => {
      return server.auth(CREDENTIALS.user, CREDENTIALS.password);
    });

    test('should deny publish of package when unauthenticated', () => {
      return server.auth(WRONG_CREDENTIALS.user, CREDENTIALS.password).then(() => {
        return server
          .putPackage(PACKAGE.NAME, fixturePkg(PACKAGE.NAME))
          .status(HTTP_STATUS.FORBIDDEN)
          .then(body => {
            expect(body).toHaveProperty('error');
          });
      });
    });

    test('should allow publish of package when gitlab groups match', () => {
      return server
        .putPackage(PACKAGE.GROUP_NAME, fixturePkg(PACKAGE.GROUP_NAME))
        .status(HTTP_STATUS.CREATED)
        .body_ok(/created new package/)
        .then(body => {
          expect(body).toHaveProperty('ok');
          expect(body.ok).toMatch(/created/);
          expect(body).toHaveProperty('success');
          expect(body.success).toBe(true);
        });
    });

    test('should allow publish of scoped package when gitlab groups match', () => {
      return server
        .putPackage(PACKAGE.SCOPED_GROUP_NAME, fixturePkg(PACKAGE.SCOPED_GROUP_NAME))
        .status(HTTP_STATUS.CREATED)
        .body_ok(/created new package/)
        .then(body => {
          expect(body).toHaveProperty('ok');
          expect(body.ok).toMatch(/created/);
          expect(body).toHaveProperty('success');
          expect(body.success).toBe(true);
        });
    });

    test('should allow publish of scoped package when gitlab projects match', () => {
      return server
        .putPackage(PACKAGE.SCOPED_PROJECT_NAME, fixturePkg(PACKAGE.SCOPED_PROJECT_NAME))
        .status(HTTP_STATUS.CREATED)
        .body_ok(/created new package/)
        .then(body => {
          expect(body).toHaveProperty('ok');
          expect(body.ok).toMatch(/created/);
          expect(body).toHaveProperty('success');
          expect(body.success).toBe(true);
        });
    });
  });
};
