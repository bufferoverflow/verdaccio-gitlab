# Verdaccio-GitLab

Use [GitLab Community Edition](https://gitlab.com/gitlab-org/gitlab-ce)
as authentication provider for the private npm registry
[Verdaccio](https://github.com/verdaccio/verdaccio), the sinopia fork.

[![npm](https://badge.fury.io/js/verdaccio-gitlab.svg)](http://badge.fury.io/js/verdaccio-gitlab)
[![build](https://travis-ci.org/bufferoverflow/verdaccio-gitlab.svg?branch=master)](https://travis-ci.org/bufferoverflow/verdaccio-gitlab)
[![dependencies](https://david-dm.org/bufferoverflow/verdaccio-gitlab/status.svg)](https://david-dm.org/bufferoverflow/verdaccio-gitlab)

The main goal and differences from other sinopia/verdaccio plugins are
the following:

- no admin token required
- user authenticates with Personal Access Token
- access & publish packages depending on user rights in gitlab

> This is experimental!

## Gitlab Version Compatibility

- If `legacy_mode: false` or undefined (default mode): Gitlab 11.2+
- If `legacy_mode: true`: Gitlab 9.0+

## Use it

You need at least node version 8.x.x, codename **carbon**.

```sh
git clone https://github.com/bufferoverflow/verdaccio-gitlab.git
cd verdaccio-gitlab
yarn install
yarn start
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

Restart Verdaccio and authenticate using your credentials

- Username: GitLab username
- Password: [Personal Access Token](https://gitlab.com/profile/personal_access_tokens)

using the Web UI [http://localhost:4873](http://localhost:4873) or via npm CLI:

```sh
yarn login --registry http://localhost:4873
```

and publish packages:

```sh
yarn publish --registry http://localhost:4873
```

## Access Levels

Access and publish access rights depending on the mode used.

### Normal Mode

In the default mode, packages are available:

- *access* is allowed depending on verdaccio `package` configuration
  directives (unauthenticated / authenticated)
- *publish* is allowed if the package name matches the logged in user
  id, or if the package name / scope of the package matches one of the
  user groups and the user has `auth.gitlab.publish` access rights on
  the group

For instance, assuming the following configuration:

- `auth.gitlab.publish` = `$maintainer`
- the gitlab user `sample_user` has access to group `group1` as
  `$maintainer` and `group2` as `$reporter`
- then this user could publish any of the npm packages:
  - `sample_user`
  - any package under `group1/**`
  - error if the user tries to publish any package under `group2/**`

### Legacy Mode

If using the legacy mode, the system behaves as in normal mode with
fixed configuration `auth.gitlab.publish` = `$owner`

## Configuration Options

The full set of configuration options is:

```yaml
auth:
  gitlab:
    url: <url>
    authCache:
      enabled: <boolean>
      ttl: <integer>
    legacy_mode: <boolean>
    publish: <string>
```

<!-- markdownlint-disable MD013 -->
| Option | Default | Type | Description |
| ------ | ------- | ---- | ----------- |
| `url` | `<empty>` | url | mandatory, the url of the gitlab server |
| `authCache: enabled` | `true` | boolean | activate in-memory authentication cache |
| `authCache: ttl` | `300` (`0`=unlimited) | integer | time-to-live of entries in the authentication cache, in seconds |
| `legacy_mode` | `false` | boolean | gitlab versions pre-11.2 do not support groups api queries based on access level; this enables the legacy behaviour of only allowing npm publish operations on groups where the logged in user has owner rights |
| `publish` | `$maintainer` | [`$guest`, `$reporter`, `$developer`, `$maintainer`, `$owner`] | group minimum access level of the logged in user required for npm publish operations (does not apply in legacy mode) |
<!-- markdownlint-enable MD013 -->

## Authentication Cache

In order to avoid too many authentication requests to the underlying
gitlab instance, the plugin provides an in-memory cache that will save
the detected groups of the users for a configurable ttl in seconds.

No clear-text password will is saved in-memory, just an SHA-256 hash of
the user+password, plus the groups information.

By default, the cache will be enabled and the credentials will be stored
for 300 seconds. The ttl is checked on access, but there's also an
internal timer that will check expired values regularly, so data of
users not actively interacting with the system will also be eventually
invalidated.

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
yarn release:major
yarn release:minor
yarn release:patch
```

finally run

```sh
yarn publish
```

## Flow Support

In order to support flow, flow-typed support files are installed in the
repo. These are generated based on the dependencies of the project and
committed to the repository.

Anytime the project dependencies change, run the following command to
update the flow-typed support files:

```bash
# Just once in your environment
yarn global add flow-typed

flow-typed install
```

## Inspired by

- [verdaccio-ldap](https://github.com/Alexandre-io/verdaccio-ldap)
- [node-bacstack](https://github.com/fh1ch/node-bacstack)
- [verdaccio-bitbucket](https://github.com/idangozlan/verdaccio-bitbucket)

## License

[MIT](https://spdx.org/licenses/MIT)
