// @flow

import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import { GITLAB_DATA, CREDENTIALS } from '../config.functional';
import { GITLAB, HTTP_STATUS } from '../../lib/constants';


export default class GitlabServer {
  app: any;
  server: any;
  expectedToken: string;

  constructor() {
    this.app = express();
    this.expectedToken = CREDENTIALS.password;
  }

  start(port: number): Promise<any> {
    return new Promise((resolve) => {
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({
        extended: true
      }));

      this.app.get('/api/v4/user', (req, res) => {
        this._checkAuthentication(req, res, () => {
          res.send(GITLAB_DATA.testUser);
        });
      });

      this.app.get('/api/v4/groups', (req, res) => {
        this._checkAuthentication(req, res, () => {
          res.send(GITLAB_DATA.testUserGroups);
        });
      });

      this.app.get('/api/v4/projects', (req, res) => {
        this._checkAuthentication(req, res, () => {
          res.send(GITLAB_DATA.testUserProjects);
        });
      });

      this.server = this.app.listen(port, () => {
        console.log(chalk.blue(`gitlab mock listening on port: ${port}`));
        resolve(this);
      });
      console.log(chalk.blue(`Running gitlab mock server via express`));
    });
  }

  _checkAuthentication(req: any, res: any, cb: any) {
    if (req.get('private-token') === this.expectedToken) {
      cb();
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).send(GITLAB.UNAUTHENTICATED);
    }
  }
}
