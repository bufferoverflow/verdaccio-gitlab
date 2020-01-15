#### 3.0.1 (2020-01-15)

##### Chores

*  move babel config to package.json ([7777984e](https://github.com/bufferoverflow/verdaccio-gitlab/commit/7777984eac1bc819268f234d60187c64b9f3696d))
*  require node 10 ([c2c96b60](https://github.com/bufferoverflow/verdaccio-gitlab/commit/c2c96b607026d6243e1ff5664dfb4e7ec43c353c))
*  remove unused eslint rules ([4c400380](https://github.com/bufferoverflow/verdaccio-gitlab/commit/4c400380b67978bbce327748998cb25cb7135050))
*  move eslint config to package.json ([9f7fdda5](https://github.com/bufferoverflow/verdaccio-gitlab/commit/9f7fdda5a40a9fda7a88b3f6dcf215fb6aad5cab))
*  upgrade devDependencies ([bca14302](https://github.com/bufferoverflow/verdaccio-gitlab/commit/bca143026cba6bd57adbf4562be9da54094fb85a))
*  remove repolinter ([708d58ba](https://github.com/bufferoverflow/verdaccio-gitlab/commit/708d58ba3236dd9ee454252d6676068c99c591b1))
*  upgrade husky ([23718d8c](https://github.com/bufferoverflow/verdaccio-gitlab/commit/23718d8c270b2c1302d0f5f736d44fa096cc9667))
*  update commitlint configuration with husky ([dd8aac59](https://github.com/bufferoverflow/verdaccio-gitlab/commit/dd8aac59d7649d8ff05b4943c77a1169ccc269eb))
*  use verdaccio 4 instead of 4.0 within Dockerfile ([abd814e2](https://github.com/bufferoverflow/verdaccio-gitlab/commit/abd814e213ddd6db4dc84b1e3a6886849e3d9be0))
*  make license-checker less verbose ([9ced2cbf](https://github.com/bufferoverflow/verdaccio-gitlab/commit/9ced2cbf70602e2e703317b4a7ca95c1345b0739))
* **ci:**  build docker image ([1bb23656](https://github.com/bufferoverflow/verdaccio-gitlab/commit/1bb23656fbf102b14d55220f90cf3c5fa4622140))

##### Documentation Changes

*  add Contributing section, cleanup ([a66fb59b](https://github.com/bufferoverflow/verdaccio-gitlab/commit/a66fb59bc461ee27f62be9773d3460f7ee0c221c))
*  align please note style and use quote ([ef1163e5](https://github.com/bufferoverflow/verdaccio-gitlab/commit/ef1163e54657f0e22643ca84d23f530361a4eeb4))
*  set publish to  within sample ([f03b3b4c](https://github.com/bufferoverflow/verdaccio-gitlab/commit/f03b3b4cdce4e41a930b3011dd5bef219a1edab0))
*  remove flow support as we have typescript now ([3d439af6](https://github.com/bufferoverflow/verdaccio-gitlab/commit/3d439af6d6cf2150068638fa6db03189d7404029))
*  clarify publish options ([2dfde28a](https://github.com/bufferoverflow/verdaccio-gitlab/commit/2dfde28a8e5b767f373ef490ce232dc6aeb72176))

##### Refactors

*  set authCache as optional member ([a9e12460](https://github.com/bufferoverflow/verdaccio-gitlab/commit/a9e124604b2673a4b3155551e0e133a48110e0a9))

##### Code Style Changes

*  use typescript style import ([97685933](https://github.com/bufferoverflow/verdaccio-gitlab/commit/97685933765a25d280b32eda3238891e65d537ac))
*  set member accessibility explicit ([21afb3d7](https://github.com/bufferoverflow/verdaccio-gitlab/commit/21afb3d74b5fe8b20eccc60440f9fbfb231d5fc0))
*  remove useless ts-ignore, fix no-use-before-define ([23fcd472](https://github.com/bufferoverflow/verdaccio-gitlab/commit/23fcd472216aa96234325960c8027b4444d0a218))
*  adopt code style to rules ([f30d3821](https://github.com/bufferoverflow/verdaccio-gitlab/commit/f30d3821928d3ba91af3d26a56c197bdfb675884))

##### Tests

*  align functional test suite to verdaccio ([fd2b97b4](https://github.com/bufferoverflow/verdaccio-gitlab/commit/fd2b97b4d02e066da20c2329801a78daa505a7f6))
*  convert package fixture to typescript ([d3374af8](https://github.com/bufferoverflow/verdaccio-gitlab/commit/d3374af870e81fd1bc1bf2152be1cd7542247480))

## 3.0.0 (2019-12-19)

##### Chores

* **lint:**  add markdownlint, use lint instead of lint:ts witin ci ([8af48c38](https://github.com/bufferoverflow/verdaccio-gitlab/commit/8af48c3877c9ea8d8b0d718d2aa1041ca7f9a70f))
*  upgrade commitlint and jest-environment-node ([6d4fd063](https://github.com/bufferoverflow/verdaccio-gitlab/commit/6d4fd0630daf1dc5e3623b4d55926add265e6f4a))
*  remove warning ([74e9e8e9](https://github.com/bufferoverflow/verdaccio-gitlab/commit/74e9e8e90363b201c87d413a60bf2d0b97fdb3be))
*  add prettier conf ([5dc2c674](https://github.com/bufferoverflow/verdaccio-gitlab/commit/5dc2c674a1866c79fb1738d2eb470999031c936c))
*  remove eclint ([2f04b5cd](https://github.com/bufferoverflow/verdaccio-gitlab/commit/2f04b5cd935323f75eedeb114b96393a02f5adf9))
*  fix wrong error ([f7736b46](https://github.com/bufferoverflow/verdaccio-gitlab/commit/f7736b46e75970bfb6a133c3abb8ab5565e0beef))
*  add missing dependency ([8407cdac](https://github.com/bufferoverflow/verdaccio-gitlab/commit/8407cdac9b05d04358c910d712e00099aceeec88))
*  fix test ([9a424f9d](https://github.com/bufferoverflow/verdaccio-gitlab/commit/9a424f9d903c121ee2b2a4e28382ba056d19f422))
*  fix lint issues ([4eed60d7](https://github.com/bufferoverflow/verdaccio-gitlab/commit/4eed60d764d450f731be87bc470449347ff6c30b))
*  lint issues ([6085b6fc](https://github.com/bufferoverflow/verdaccio-gitlab/commit/6085b6fc7efb79aba619f3deed2b804a4f57bf1a))
*  migrating to typescript ([56d11877](https://github.com/bufferoverflow/verdaccio-gitlab/commit/56d118775f4ccb06f074015e9eddf993cece4428))
*  upgrade verdaccio to latest stable 4.0.0 ([ebdea8ac](https://github.com/bufferoverflow/verdaccio-gitlab/commit/ebdea8accc58952486909120ce78da8f9e4b8ae7))
* **deps:**
  *  bump handlebars from 4.0.11 to 4.1.2 ([c3acd112](https://github.com/bufferoverflow/verdaccio-gitlab/commit/c3acd112a087361028bd1534805d719464cdfe6f))
  *  allow patches & minor updates on verdaccio dependency ([6d752fee](https://github.com/bufferoverflow/verdaccio-gitlab/commit/6d752fee1fc5c37fe10f687304bd49b56d12a7b1))
* **deps-dev:**  bump lodash from 4.17.10 to 4.17.13 ([82848808](https://github.com/bufferoverflow/verdaccio-gitlab/commit/82848808f5156c09b12a765cda998847dff1d8cf))
* **docker:**  update verdaccio dep to 4.0 ([c2beeba0](https://github.com/bufferoverflow/verdaccio-gitlab/commit/c2beeba096a7c802a3fd49889521e7e1b10e60c4))

##### Documentation Changes

*  remove references to normal mode in readme ([ab36d309](https://github.com/bufferoverflow/verdaccio-gitlab/commit/ab36d309d45a6b7a49c606c53d54336eb8c4a46a))
*  fix typo within README.md ([23c8a598](https://github.com/bufferoverflow/verdaccio-gitlab/commit/23c8a598352d16a87b8e40e107b1969b2added4e))

##### New Features

*  get rid of legacy mode ([2fa6944c](https://github.com/bufferoverflow/verdaccio-gitlab/commit/2fa6944cc3f43c31f32127a61bb4e09b22504461))

##### Bug Fixes

* **auth:**
  *  compare to lower-cased version of user ([82b7d1a8](https://github.com/bufferoverflow/verdaccio-gitlab/commit/82b7d1a85760b7780e331240d9bd1e6e0bc3388c))
  *  allows matching of mixed-case usernames ([d75f3003](https://github.com/bufferoverflow/verdaccio-gitlab/commit/d75f30030a390de7597a18aa284779e4c508ba70))

##### Refactors

*  update dependencies and script ([87c679d3](https://github.com/bufferoverflow/verdaccio-gitlab/commit/87c679d3fe1e2650165a2ed3876feaa90adf71a3))
*  update dependencies ([cde1a60f](https://github.com/bufferoverflow/verdaccio-gitlab/commit/cde1a60f021c4e809c88e011e91a3d19bbfe1596))
*  upgrade to latest flow-types for verdaccio 4.x ([03db18d9](https://github.com/bufferoverflow/verdaccio-gitlab/commit/03db18d973425338599fe8b2cdbbbf871868ba44))

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
