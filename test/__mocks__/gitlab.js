const mock = jest.fn().mockImplementation(() => {
  return {
    Users: {
      current: () => {
        return Promise.resolve({
          username: 'myUser'
        });
      }
    },
    Groups: {
      all: (params) => { // eslint-disable-line no-unused-vars
        return Promise.resolve([{
          path: 'myGroup',
          full_path: 'myGroup'
        }]);
      }
    },
    Projects: {
      all: (params) => { // eslint-disable-line no-unused-vars
        return Promise.resolve([{
          path_with_namespace: 'anotherGroup/myProject'
        }]);
      }
    }
  };
});

export default mock;
