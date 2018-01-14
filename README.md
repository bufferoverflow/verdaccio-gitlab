# Verdaccio-GitLab

Use [GitLab Community Edition](https://gitlab.com/gitlab-org/gitlab-ce)
as authentication provider for the private npm registry
[verdaccio](https://github.com/verdaccio/verdaccio), the sinopia fork.

[![](https://badge.fury.io/js/verdaccio-gitlab.svg)](http://badge.fury.io/js/verdaccio-gitlab)
[![](https://travis-ci.org/bufferoverflow/verdaccio-gitlab.svg?branch=master)](https://travis-ci.org/bufferoverflow/verdaccio-gitlab)
[![](https://david-dm.org/bufferoverflow/verdaccio-gitlab/status.svg)](https://david-dm.org/bufferoverflow/verdaccio-gitlab)

The main goal and difference to other sinopia/verdaccio plugins is:

- no admin token required
- user authenticates with Personal Access Token
- owned groups (no subgroups) are added to the user
- publish packages if package scope or name is an owned group name

> This is experimental!

## Use it

```sh
git clone https://github.com/bufferoverflow/verdaccio-gitlab.git
cd verdaccio-gitlab
npm install
npm start
```

verdaccio is now up and running, now configure the following within
your `~/.config/verdaccio/config.yaml` to use this plugin

```yaml
auth:
  gitlab:
    url: https://gitlab.com

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
```

restart verdaccio and authenticate with your credentials:

- gitlab username
- [Personal Access Token](https://gitlab.com/profile/personal_access_tokens)

on the web ui [http://localhost:4873](http://localhost:4873) or via npm

```sh
npm login --registry http://localhost:4873
```

and publish packages

```sh
npm publish --registry http://localhost:4873
```

> **NOTE**: you need a fresh login, so that verdaccio recognizes your owned groups

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

## Todo

- [x] authenticate with personal access token
- [x] compare provided user name and GitLab username
- [x] get user groups from GitLab
- [x] authorize publish based on group ownership
- [x] Docker Compose setup of GitLab and Verdaccio
- [ ] how to handle group owner ship changes? timeout?
- [ ] use openid connect for web ui
- [ ] improve linting, eslint vs. jshint vs. babel ,etc.
- [ ] pass repolinter
- make it perfect ;-r

## Inspired by

- [verdaccio-ldap](https://github.com/Alexandre-io/verdaccio-ldap)
- [node-bacstack](https://github.com/fh1ch/node-bacstack)
- [verdaccio-bitbucket](https://github.com/idangozlan/verdaccio-bitbucket)

## License

[MIT](https://spdx.org/licenses/MIT)
