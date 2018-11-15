// @flow

export interface IVerdaccioConfig {
  storagePath: string;
  configPath: string;
  domainPath: string;
  port: number;
}

export interface IRequestPromise {
  status(reason: any): any;
  body_ok(reason: any): any;
  body_error(reason: any): any;
  request(reason: any): any;
  response(reason: any): any;
  send(reason: any): any;
}

export interface IServerProcess {
  bridge: IServerBridge;
  config: IVerdaccioConfig;
  childFork: any;
  isDebug: boolean;
  silence: boolean;
  init(): Promise<any>;
  stop(): void;
}

declare class verdaccio$PromiseAssert<IRequestPromise> extends Promise<any> {
  constructor(options: any): IRequestPromise;
}

export interface IServerBridge {
  url: string;
  userAgent: string;
  authstr: string;
  request(options: any): typeof verdaccio$PromiseAssert;
  auth(name: string, password: string): IRequestPromise;
  logout(token: string): Promise<any>;
  auth(name: string, password: string): IRequestPromise;
  getPackage(name: string): Promise<any>;
  putPackage(name: string, data: any): Promise<any>;
  putVersion(name: string, version: string, data: any): Promise<any>;
  putTarball(name: string, filename: string, data: any): Promise<any>;
  whoami(): Promise<any>;
  ping(): Promise<any>;
  debug(): IRequestPromise;
}
