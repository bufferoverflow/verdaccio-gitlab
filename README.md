# Verdaccio-GitLab

Use GitLab as authentication provider for verdaccio.

The main goal and difference to other sinopia/verdaccio plugins is:

- no admin token required
- user authenticates with Personal Access Token

> This is experimental!

## Install

As simple as running:

```sh
npm install -g verdaccio-gitlab
```

## Configure

```yaml
auth:
  gitlab:
    url: https://gitlab.com
```

## Todo

- [x] authenticate with personal access token
- [x] compare provided user name and GitLab username
- [ ] get user groups from GitLab
- [ ] authorize based on group member ship
  - [ ] publish
  - [ ] pull
- [ ] use openid connect for web ui
- [ ] improve linting, eslint vs. jshint, etc.
- [ ] pass repolinter
- make it perfect ;-r

## License

[MIT](https://spdx.org/licenses/MIT)
