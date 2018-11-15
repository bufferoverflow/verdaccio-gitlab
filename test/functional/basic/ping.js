import _ from 'lodash';

module.exports = (server) => {

  test('ping', () => {
    return server.ping().then((data) => {
      // it's always an empty object
      expect(_.isObject(data)).toBeDefined();
    });
  });

};

