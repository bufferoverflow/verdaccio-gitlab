# Verdaccio-GitLab

Use [GitLab Community Edition](https://gitlab.com/gitlab-org/gitlab-ce)
as authentication provider for the private npm registry
[Verdaccio](https://github.com/verdaccio/verdaccio), the sinopia fork.

[![npm](https://badge.fury.io/js/verdaccio-gitlab.svg)](http://badge.fury.io/js/verdaccio-gitlab)
[![build](https://travis-ci.org/bufferoverflow/verdaccio-gitlab.svg?branch=master)](https://travis-ci.org/bufferoverflow/verdaccio-gitlab)
[![dependencies](https://david-dm.org/bufferoverflow/verdaccio-gitlab/status.svg)](https://david-dm.org/bufferoverflow/verdaccio-gitlab)

The main goal and the difference from other sinopia/verdaccio plugins are
the following:

- no admin token required
- user authenticates with Personal Access Token
- owned groups (no subgroups) are added to the user
- publish packages if package scope or name is an owned group name

> This is experimental!

## Use it

You need at least node version 6.x.x, codename boron.

```sh
git clone https://github.com/bufferoverflow/verdaccio-gitlab.git
cd verdaccio-gitlab
npm install
npm start
```

> **NOTE**: Define `http_proxy` environment variable if you are behind a proxy.

Verdaccio is now up and running. In order the see this plugin in action, you can
use the following Verdaccio configuration in your `~/.config/verdaccio/config.yaml`.

```yaml
# Verdaccio storage location relative to $HOME/.config/verdaccio
storage: ./storage

listen:
  - 0.0.0.0:4873

auth:
  gitlab:
    url: https://gitlab.com
    authCache:
      enabled: true
      ttl: 300

uplinks:
  npmjs:
    url: https://registry.npmjs.org/

packages:
  '@*/*':
    # scoped packages
    access: $all
    publish: $authenticated
    proxy: npmjs
    gitlab: true

  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
    gitlab: true

# Log level can be changed to info, http etc. for less verbose output
logs:
  - {type: stdout, format: pretty, level: debug}
```

Restart Verdaccio and authenticate into it with your credentials

- Username: GitLab username
- Password: [Personal Access Token](https://gitlab.com/profile/personal_access_tokens)

using the Web UI [http://localhost:4873](http://localhost:4873) or via npm CLI:

```sh
npm login --registry http://localhost:4873
```

and publish packages:

```sh
npm publish --registry http://localhost:4873
```

> **NOTE**: In order to publish packages, you need to create or be part of
a GitLab group (as owner) which has the same name as your package name. You
also need a fresh login, so that Verdaccio recognizes your owned groups.

## Authentication Cache

In order to avoid too many authentication requests to the underlying
gitlab instance, the plugin provides an in-memory cache that will save
the detected groups of the users for a configurable ttl in seconds.
No clear-text password will be saved in-memory, just an SHA-256 hash
and the groups information.

By default, the cache will be enabled and the credentials will be stored
for 300 seconds. The ttl is checked on access, but there's also an
internal timer that will check expired values regularly, so data of
users not actively interacting with the system will also be eventually
invalidated.

```yaml
auth:
  gitlab:
    url: https://gitlab.com
    authCache:
      enabled: (default true)
      ttl: (default: 300)
```

*Please note* that this implementation is in-memory and not
multi-process; if the cluster module is used for starting several
verdaccio processes, each process will store its own copy of the cache,
so each user will actually be logged in multiple times.

## Docker

```sh
git clone https://github.com/bufferoverflow/verdaccio-gitlab.git
cd verdaccio-gitlab
docker-compose up --build -d
```

- login with user `root` and password `verdaccio` on Gitlab via [http://localhost:50080](http://localhost:50080)
- create a Personal Access Token
- login to the npm registry [http://localhost:4873](http://localhost:4873) via browser
- publish your packages via command line

## Create a Release

Run one of the following command to create a release:

```sh
npm run release:major
npm run release:minor
npm run release:patch
```

finally run

```sh
npm publish
```

## Flow Support

In order to support flow, flow-typed support files are installed in the
repo. These are generated based on the dependencies of the project and
committed to the repository.

Anytime the project dependencies change, run the following command to
update the flow-typed support files:

```bash
# Just once in your environment
npm install -g flow-typed

flow-typed install
```

## Inspired by

- [verdaccio-ldap](https://github.com/Alexandre-io/verdaccio-ldap)
- [node-bacstack](https://github.com/fh1ch/node-bacstack)
- [verdaccio-bitbucket](https://github.com/idangozlan/verdaccio-bitbucket)

## License

[MIT](https://spdx.org/licenses/MIT)
