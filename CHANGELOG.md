### 2.2.0 (2018-12-07)

##### New Features

*  add project groups ([cb13b62c](https://github.com/bufferoverflow/verdaccio-gitlab/commit/cb13b62c0adef627cbc00f227348e11a20dad9ac))

### 2.1.0 (2018-11-23)

##### Chores

*  upgrade verdaccio to latest stable 3.8.6 ([ee3f3d97](https://github.com/bufferoverflow/verdaccio-gitlab/commit/ee3f3d97daf6116bd7761fc4d59e75b8cdb833c5))
*  add functional tests ([22e91e81](https://github.com/bufferoverflow/verdaccio-gitlab/commit/22e91e81ceb32e3a0df5b06165e0cc4a9a86194f))
*  add functional tests ([6f2d6b62](https://github.com/bufferoverflow/verdaccio-gitlab/commit/6f2d6b625ecc6dfcaa9852685c5c2ac971f107a0))

##### Documentation Changes

*  explain how to overwrite default conf with dockerfile ([76ad223c](https://github.com/bufferoverflow/verdaccio-gitlab/commit/76ad223cee4c49a8785d95beb4b1337b48da7441))

##### New Features

*  make allow_access behave closer to htpasswd default auth plugin ([ccf53254](https://github.com/bufferoverflow/verdaccio-gitlab/commit/ccf53254d95555a9232ad617aa680b7cc2e883dc))
*  make allow_access behave closer to htpasswd default auth plugin ([6e4c1768](https://github.com/bufferoverflow/verdaccio-gitlab/commit/6e4c1768428438e0199f25ed3c4b568e877527a6))
*  make allow_access behave closer to htpasswd default auth plugin ([366bc5c2](https://github.com/bufferoverflow/verdaccio-gitlab/commit/366bc5c21e512ad717064701314277b109b0697c))

##### Refactors

*  consistent use of plugin chain ([14b8b186](https://github.com/bufferoverflow/verdaccio-gitlab/commit/14b8b1860593c818fa14825fe7be05f89929883f))

## 2.0.0 (2018-09-03)

##### Chores

*  fix yarn parameter for publishing ([adfee8e4](https://github.com/bufferoverflow/verdaccio-gitlab/commit/adfee8e4f8851646a903edfdf2e4c0a65843a419))
*  misc corrections ([d81439d4](https://github.com/bufferoverflow/verdaccio-gitlab/commit/d81439d41f965d01e4fbedb5ad288c3b95ede43d))
*  misc corrections ([37c46e69](https://github.com/bufferoverflow/verdaccio-gitlab/commit/37c46e69c20b30b105fa41fcc70d932dbbe857a8))
*  automated unit testing with jest ([b506d7ae](https://github.com/bufferoverflow/verdaccio-gitlab/commit/b506d7ae2395244594187774b88274504c780335))
*  build refactor and jest testing support ([1e515c0d](https://github.com/bufferoverflow/verdaccio-gitlab/commit/1e515c0d5547b2c80ea9a324f93c814d867c85dd))
*  update dependencies ([c2567be4](https://github.com/bufferoverflow/verdaccio-gitlab/commit/c2567be4baa5acd9bfa16999968cb329865864b9))
*  fix yarn scripts syntax ([c11aad20](https://github.com/bufferoverflow/verdaccio-gitlab/commit/c11aad2010d0859e23f0df8c40da4240c5839900))
*  improve logging statements ([0462e349](https://github.com/bufferoverflow/verdaccio-gitlab/commit/0462e34995841eb5e383d5a49830fc39fe5737f9))
*  update all dependencies ([48b9a729](https://github.com/bufferoverflow/verdaccio-gitlab/commit/48b9a729cb43eb92530b356022fd062eb8048468))
*  drop node 6 support ([144cdb46](https://github.com/bufferoverflow/verdaccio-gitlab/commit/144cdb46293e2ad608db94f8878c5a7240ac24f1))
*  fix node runtime dependencies ([a616c253](https://github.com/bufferoverflow/verdaccio-gitlab/commit/a616c25373d10112b319ed3854aa216eef64d450))
*  used node >= 6.12.0 ([70b98348](https://github.com/bufferoverflow/verdaccio-gitlab/commit/70b983482a1ad6d81a9771e08165be8fca91422d))
*  get rid of npm linka and run verdaccio cli ([aeb16899](https://github.com/bufferoverflow/verdaccio-gitlab/commit/aeb168993e97530b8748199bf363b2416face7a0))
*  update devDependencies ([8520b471](https://github.com/bufferoverflow/verdaccio-gitlab/commit/8520b4719bf803cb9d8546fd242d2a7ccae92ef6))
*  use gitlab 3.2.2 ([360959aa](https://github.com/bufferoverflow/verdaccio-gitlab/commit/360959aab07c260ebf30916e5741b3a583dc76d5))
*  use verdaccio v3.0.0-beta.7 ([e4f66624](https://github.com/bufferoverflow/verdaccio-gitlab/commit/e4f6662416691a05fd0aa2f81e9f8b8b77e5b048))
* **lint:**
  *  upgrade markdownlint-cli ([20bb5a59](https://github.com/bufferoverflow/verdaccio-gitlab/commit/20bb5a59fa42fa5ed6d31c29dc4538cf95699bef))
  *  use eslint instead of jslint and jshint ([82bf88ea](https://github.com/bufferoverflow/verdaccio-gitlab/commit/82bf88eaa0f8a5711f3989cd6a68f57d5d13738f))

##### Documentation Changes

*  mention that at least node 8 (carbon) is required ([0521b4b1](https://github.com/bufferoverflow/verdaccio-gitlab/commit/0521b4b12283f91fef011d49dd0188c694f6b8f0))
*  use alt text for badges ([27296ee3](https://github.com/bufferoverflow/verdaccio-gitlab/commit/27296ee34628f81c0629705b7a2832ed1744ef23))
*  use GitHub issues instead of Todo within README.md ([ca061e90](https://github.com/bufferoverflow/verdaccio-gitlab/commit/ca061e904fcf35ec86b1fec7c2942873f87ac3f2))
* **readme:**
  *  minor typo and grammatical fixes to readme ([08b0276b](https://github.com/bufferoverflow/verdaccio-gitlab/commit/08b0276b6966b4cf8975af253c6efcbba98a0e49))
  *  add usage clarifications in readme ([71ff969c](https://github.com/bufferoverflow/verdaccio-gitlab/commit/71ff969c44578a432e6ad2125bb8a758417c5b35))

##### New Features

*  gitlab-11.2-group-api-improvements ([207a490d](https://github.com/bufferoverflow/verdaccio-gitlab/commit/207a490dc4d9da4784c69c0f5d428e08d96e01bc))
*  gitlab-11.2-group-api-improvements ([68068bf1](https://github.com/bufferoverflow/verdaccio-gitlab/commit/68068bf1c96c4c82805d39d13d71e2b9c615e02f))
*  gitlab-11.2-group-api-improvements ([9353fc37](https://github.com/bufferoverflow/verdaccio-gitlab/commit/9353fc37d5664e08b1e7e1e1eed463e787d1ad4e))
*  use types and classes ([255f85b5](https://github.com/bufferoverflow/verdaccio-gitlab/commit/255f85b547cd1e3b64dfb5908f890d6211a589d6))
*  transpile using babel ([68659626](https://github.com/bufferoverflow/verdaccio-gitlab/commit/6865962628f9e006c1bf5fc71eff7e7b64488511))

##### Bug Fixes

*  improve auth handling ([8bde1977](https://github.com/bufferoverflow/verdaccio-gitlab/commit/8bde1977fde91d75ae7103a40ce9c4bf093e1534))
*  flow ([f4113963](https://github.com/bufferoverflow/verdaccio-gitlab/commit/f4113963cfd0d0c836db08d128092b21d475e300))

##### Refactors

*  access should fail if unauthenticated depending on verdaccio ([8310d05c](https://github.com/bufferoverflow/verdaccio-gitlab/commit/8310d05c4977a28fa8e76df763bb775324db94d6))
*  docker build improvements ([04603ad1](https://github.com/bufferoverflow/verdaccio-gitlab/commit/04603ad12c17b0f4f2c6d20d9af89d38af60f0f6))
*  migrate from npm to yarn ([35a555e9](https://github.com/bufferoverflow/verdaccio-gitlab/commit/35a555e96cac3c334a8258efd48b2b2c50b352e3))
*  add flow support to eslint configuration ([0f3d4a44](https://github.com/bufferoverflow/verdaccio-gitlab/commit/0f3d4a44be43a359766e267f213414e391c900bd))
*  add configurable authentication cache ([31bb3096](https://github.com/bufferoverflow/verdaccio-gitlab/commit/31bb309638f0240f97da084d07da7f462311832e))
* **gitlab:**  simplify allow_publish function ([dbe36e3d](https://github.com/bufferoverflow/verdaccio-gitlab/commit/dbe36e3dabf4a2ee72b8daacabd22c8daeed63ee))
* **dockerfile:**  multistage builder / random uid user support ([6edd7016](https://github.com/bufferoverflow/verdaccio-gitlab/commit/6edd701682719582a03fbba8b808785859a1f08b))

##### Code Style Changes

* **gitlab:**  consistent white-space usage ([eea4c9ec](https://github.com/bufferoverflow/verdaccio-gitlab/commit/eea4c9ece3170de3511c1631c588d2cee5d40eb8))

## 1.0.0 (2018-02-02)

##### Bug Fixes

*  call next plugin ([e4aaa339](https://github.com/bufferoverflow/verdaccio-gitlab/commit/e4aaa339c7ead89a381e59a2be4201980ffc0951))
* **docker:**  remove registry stuff from docker-compose ([6cd53c7e](https://github.com/bufferoverflow/verdaccio-gitlab/commit/6cd53c7ed49dba3cfa6f6100b3796ece304b5cfb))

#### 0.0.5 (2018-01-22)

##### Chores

*  use husky and git commitmsg hook ([eb23c9f5](https://github.com/bufferoverflow/verdaccio-gitlab/commit/eb23c9f52c48537178b2fc9caf9dc44d449b18b8))
*  use node-gitlab-api 2.2.0 ([c7b682dc](https://github.com/bufferoverflow/verdaccio-gitlab/commit/c7b682dcfc3e55a3fba9827a82cf54fa86abe97d))
*  use license-checker to enforce license compliance ([c8008d4b](https://github.com/bufferoverflow/verdaccio-gitlab/commit/c8008d4b2d16b3300af8a22ce662e92983ce9b61))
*  use verdaccio 2.7.3 ([01350e61](https://github.com/bufferoverflow/verdaccio-gitlab/commit/01350e610e3557c96b1e10e59dd2fc66ee5475be))
* **docker:**  use carbon-alpine ([72b84e40](https://github.com/bufferoverflow/verdaccio-gitlab/commit/72b84e40c100e404f9feb8792b04eb327e9b0c4f))

##### Documentation Changes

*  add development section ([a0561b75](https://github.com/bufferoverflow/verdaccio-gitlab/commit/a0561b75acdfcfba12d502f776e676e4988ca768))

##### New Features

*  authorize access for authenticated users ([58eb2cd3](https://github.com/bufferoverflow/verdaccio-gitlab/commit/58eb2cd36079f42b0c4d43340727285173d0895e))

#### 0.0.4 (2018-01-14)

##### Documentation Changes

*  improve authorization related topics ([d1f06445](https://github.com/bufferoverflow/verdaccio-gitlab/commit/d1f0644537cd1a06ea8c4098f05a30d5daf8741f))

##### New Features

*  changelog generator ([47653197](https://github.com/bufferoverflow/verdaccio-gitlab/commit/476531977e082148068ac806526612ff5498be07))

#### 0.0.3 (2018-01-14)

##### Chores

*  use commitlint/travis-cli and lts versions within travis ([5a2a0039](https://github.com/bufferoverflow/verdaccio-gitlab/commit/5a2a0039f8661aed2162ec4273aa273b1d8473dd))
*  update package-lock.json ([9801b215](https://github.com/bufferoverflow/verdaccio-gitlab/commit/9801b215f0b86d480bf148cd10e90993d44789e6))
*  update commitlint ([ea3285b8](https://github.com/bufferoverflow/verdaccio-gitlab/commit/ea3285b870656074804546bdea1b434cc1df976f))
*  update description and tags ([c30957e9](https://github.com/bufferoverflow/verdaccio-gitlab/commit/c30957e931c58345db569d91b2421baae39bfb68))
*  commitlint as part of lint ([7823617d](https://github.com/bufferoverflow/verdaccio-gitlab/commit/7823617d24a5ac35562e0e5a20e73b83f2709922))
*  add commitlint/config-conventional config ([11f7d18f](https://github.com/bufferoverflow/verdaccio-gitlab/commit/11f7d18f6c13fe83249e36876c2866f21b955f0d))

##### Documentation Changes

*  add fury, travis-ci and david-dm badge ([c1417fb7](https://github.com/bufferoverflow/verdaccio-gitlab/commit/c1417fb7539e8014485af5efef12e39219cf7168))
*  update todo section within README ([783e38ba](https://github.com/bufferoverflow/verdaccio-gitlab/commit/783e38ba83cd838f2638aa446aee3f3c7a964b83))

##### New Features

*  authorize publish based on group ownership ([9877bcf1](https://github.com/bufferoverflow/verdaccio-gitlab/commit/9877bcf15967c3c21b1b42d2758cae36f2a9e5af))
*  docker compose setup ([e92c729a](https://github.com/bufferoverflow/verdaccio-gitlab/commit/e92c729ab50b4d0dd006a203332735c34b6b47db))

#### 0.0.2 (2018-01-11)

##### Chores

*  vscode is great to debug ([9b3a167d](https://github.com/bufferoverflow/verdaccio-gitlab/commit/9b3a167dce88b09d88a50ae6983862c59762bdba))

##### Documentation Changes

*  use verdaccio github url ([83e04a08](https://github.com/bufferoverflow/verdaccio-gitlab/commit/83e04a08a6a8a9dc98684524d13f0195926528fc))

##### Bug Fixes

*  add user name to groups ([61bda536](https://github.com/bufferoverflow/verdaccio-gitlab/commit/61bda5360456c884acf3f6c38f30a46e852dc455))

#### 0.0.1 (2018-01-07)

##### Chores

*  simplify use it ([dec7e56a](https://github.com/bufferoverflow/verdaccio-gitlab/commit/dec7e56a8a90b8ef6c113716d669a7bfb6b5bc54))
*  update package.json, .travis.yml ([980156f9](https://github.com/bufferoverflow/verdaccio-gitlab/commit/980156f932ad2e67418c3c3d3b1747e7bd948e16))

##### Documentation Changes

*  improve use it ([c870ccc8](https://github.com/bufferoverflow/verdaccio-gitlab/commit/c870ccc8c34e68ee77218ce1192d346bd539a251))
*  use it section ([dece91b8](https://github.com/bufferoverflow/verdaccio-gitlab/commit/dece91b8d82701288e47dcfc6474845f1d0277dc))
*  gitlab and verdaccio infos ([70cf3963](https://github.com/bufferoverflow/verdaccio-gitlab/commit/70cf3963f14d06c04b3c4550a69f853baaff2a86))
*  add inspired by ([70d44708](https://github.com/bufferoverflow/verdaccio-gitlab/commit/70d4470850a2ff695d4d548cf8f670eaa9af9076))

##### New Features

*  use node-gitlab-api and populate owned groups ([1b51b125](https://github.com/bufferoverflow/verdaccio-gitlab/commit/1b51b125ba62de64a3aaf7a303513d74af9470df))
*  travis-ci ([e67b4e9d](https://github.com/bufferoverflow/verdaccio-gitlab/commit/e67b4e9d67d14aeed1ef4288135e63e96b131ac6))

##### Bug Fixes

*  npm start by using npm link ([65e8f243](https://github.com/bufferoverflow/verdaccio-gitlab/commit/65e8f24350ae86999b62f6582337ad6086e94718))
*  adduser is not supported ([8c8a678d](https://github.com/bufferoverflow/verdaccio-gitlab/commit/8c8a678dbfac1958468186d113dc0bb2207a56fb))
