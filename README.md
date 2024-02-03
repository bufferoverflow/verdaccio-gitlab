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

## Use it

You need at least node version 12.18.x, codename **carbon**.

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
    publish: $maintainer
    proxy: npmjs
    gitlab: true

  '**':
    access: $all
    publish: $maintainer
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
yarn login --registry http://localhost:4873
```

and publish packages:

```sh
yarn publish --registry http://localhost:4873
```

## Access Levels

Access and publish access rights are mapped following the rules below.

verdaccio-gitlab access control will only be applied to package sections that
are marked with `gitlab: true` as in the configuration sample above. If you
wish to disable gitlab authentication to any package config, just remove the
element from the config.

### Access

*access* is allowed depending on the following verdaccio `package` configuration
directives:

- authenticated users are able to access all packages
- unauthenticated users will be able to access packages marked with either
  `$all` or `$anonymous` access levels at the package group definition

> *Please note* that no group or package name mapping is applied on access, any
user successfully authenticated can access all packages.

### Publish

We have two matching strategies between the package name and the names of GitLab groups and projects, the 'default' and 'nameMapping' strategies.

<b>*publish* with "default" strategy is allowed if</b>:

1. the package name matches the GitLab username, or
2. if the package name or scope of the package matches one of the
   user's GitLab groups, or
3. if the package name (possibly scoped) matches on the user's
   GitLab projects.

For 2. and 3., the GitLab user must have the access rights on the group or
project as specified in the `auth.gitlab.publish` setting.

For instance, assuming the following configuration:

```yaml
auth:
  gitlab:
    publish = $maintainer
```

The GitLab user `sample_user` has access to:

- Group `group1` as `$maintainer`
- Group `group2` as `$reporter`
- Project `group3/project` as `$maintainer`

Then this user would be able to:

- *access* any package
- *publish* any of the following packages:
  - `sample_user`
  - `group1`
  - any package under `@group1/**`
  - `@group3/project`

There would be an error if the user tried to publish any package under `@group2/**`.

<b>*publish* with "nameMapping" strategy</b>:

The same rules apply, but with some differences:
* In cases where the scope or project name in the package is different from the group or project in GitLab, it is possible to define the mapping for these names.
* Use case-insensitive matching.
* Define the search path for group names through the searchPath variable, following the GroupSchema from the GitLab API.
* Define the search path for project names through the searchPath variable, following the ProjectSchema from the GitLab API.

## Configuration Options

The full set of configuration options is:

```yaml
auth:
  gitlab:
    url: <url>
    authCache:
      enabled: <boolean>
      ttl: <integer>
    publish: <string>
    groupSearchStrategy: 'default|nameMapping'
    groupsStrategy: # only available on groupSearchStrategy 'nameMapping'
      caseSensitive: <boolean>
      searchPath: <string>
      mappings:
        - gitlabName: <string>
          packageJsonName: <string>
    projectsStrategy: # only available on groupSearchStrategy 'nameMapping'
      caseSensitive: <boolean>
      searchPath: <string>
      mappings:
        - gitlabName: <string>
          packageJsonName: <string>
```

<!-- markdownlint-disable MD013 -->
| Option | Default | Type | Description |
| ------ | ------- | ---- | ----------- |
| `url` | `<empty>` | url | mandatory, the url of the gitlab server |
| `authCache: enabled` | `true` | boolean | activate in-memory authentication cache |
| `authCache: ttl` | `300` (`0`=unlimited) | integer | time-to-live of entries in the authentication cache, in seconds |
| `publish` | `$maintainer` | [`$guest`, `$reporter`, `$developer`, `$maintainer`, `$owner`] | group minimum access level of the logged in user required for npm publish operations |
| `groupSearchStrategy` | `'default'` | ['default', 'nameMapping'] | strategy for searching GitLab groups |
| `groupsStrategy` | | Like yaml structure above | configuration for group search strategy (only available on `groupSearchStrategy 'nameMapping'`) |
| `projectsStrategy` | | Like yaml structure above | configuration for project search strategy (only available on `groupSearchStrategy 'nameMapping'`) |
<!-- markdownlint-enable MD013 -->

## Authentication Cache

In order to avoid too many authentication requests to the underlying
gitlab instance, the plugin provides an in-memory cache that will save
the detected groups of the users for a configurable ttl in seconds.

No clear-text password is saved in-memory, just an SHA-256 hash of
the user+password, plus the groups information.

By default, the cache will be enabled and the credentials will be stored
for 300 seconds. The ttl is checked on access, but there's also an
internal timer that will check expired values regularly, so data of
users not actively interacting with the system will also be eventually
invalidated.

> *Please note* that this implementation is in-memory and not
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

The Dockerfile provides a [default configuration file](conf/docker.yaml)
that is internally available under `/verdaccio/conf/config.yaml`. In order
to overwrite this configuration you can provide your own file and mount it
on docker startup with the `--volume` option, or equivalent mechanism
(e.g. ConfigMaps on Kubernetes / OpenShift with the
[helm chart](https://github.com/helm/charts/tree/master/stable/verdaccio)).

## Development

### Contributing

Please adhere to the [verdaccio community guidelines](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md)
and run all the tests before creating a PR. The commit message shall follow the
conventional changelog as it is enforced via local commit hook using husky and
the [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint)
rule set.

> PR's that do not pass CI will not be reviewed.

### Create a Release

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

### Functional Tests

In order to run functional tests with debug output, set the
`VERDACCIO_DEBUG=true` environment variable,
[as documented by verdaccio](https://github.com/verdaccio/verdaccio/wiki/Running-and-Debugging-tests):

```bash
VERDACCIO_DEBUG=true yarn test:functional
```

## License

[MIT](https://spdx.org/licenses/MIT)
