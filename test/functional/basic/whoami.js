import { CREDENTIALS } from "../config.functional";

module.exports = (server) => {

    test('whoami', () => {
      return server.whoami().then((username) => {
        expect(username).toBe(CREDENTIALS.user);
      });
    });

};

