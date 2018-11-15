import { DOMAIN_SERVERS as localhost } from '../test.conf';

export const CREDENTIALS = {
  user: 'test',
  password: 'test',
  email: 'test@example.com',
};

export const WRONG_CREDENTIALS = {
  user: 'non_existing_user',
  password: 'wrong_password',
};

export const TARBALL = 'tarball-blahblah-file.name';
export const PORT_GITLAB_EXPRESS_MOCK = '50080';
export const PORT_SERVER_1 = '55551';

export const DOMAIN_SERVERS = localhost;

export const PACKAGE = {
  EXISTING_NAME: 'verdaccio',
  NON_EXISTING_NAME: 'non-existing-package',
  NAME: 'test-group',
  VERSION: '0.0.1',
};

export const GITLAB_DATA = {
  testUser: {
    'id': 1,
    'username': CREDENTIALS.user,
    'email': CREDENTIALS.email,
    'name': 'Test User',
    'state': 'active',
  },
  testUserGroups: [
    {
      'id': 1,
      "name": "Test Group",
      "path": "test-group",
      "description": "An interesting group",
      "visibility": "public",
      "lfs_enabled": true,
      "request_access_enabled": false,
      "full_path": "test-group",
      "parent_id": null
    },
  ]
};
