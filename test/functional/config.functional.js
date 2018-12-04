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
  NAME: 'test-name',
  GROUP_NAME: 'test-group',
  SCOPED_GROUP_NAME: '@test-group/another-project',
  SCOPED_PROJECT_NAME: '@another-group/test-project',
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
      'name': 'Test Group',
      'path': 'test-group',
      'description': 'An interesting group',
      'visibility': 'public',
      'lfs_enabled': true,
      'request_access_enabled': false,
      'full_path': 'test-group',
      'parent_id': null
    },
  ],
  testUserProjects: [
    {
      'id': 3,
      'name': 'Test Project',
      'name_with_namespace': 'Another Group / Test Project',
      'path': 'test-project',
      'path_with_namespace': 'another-group/test-project',
      'namespace': {
        'id': 2,
        'name': 'Another Group',
        'path': 'another-group',
        'kind': 'group',
        'full_path': 'another-group',
        'parent_id': null
      },
      'description': 'An interesting project group',
      'visibility': 'public',
      'lfs_enabled': true,
      'request_access_enabled': false,
      'parent_id': null
    },
  ]
};
