import * as express from 'express';
import { Application } from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import * as cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import l from './logger';
import * as AV from 'leanengine';
import { init } from '../../role';
const config = require('../../config.json');
const app = express();

export default class ExpressServer {
  constructor() {
    AV.init({
      appId: process.env.LEANCLOUD_APP_ID,
      appKey: process.env.LEANCLOUD_APP_KEY,
      masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
    });


    // 如果不希望使用 masterKey 权限，可以将下面一行删除
    const Cloud: any = AV.Cloud;
    Cloud.useMasterKey();
    init(config.adminUsername, config.adminPassword, config.adminEmail);

    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));
    // 加载云引擎中间件
    app.use(AV.express());
    // 需要重定向到 HTTPS 可去除下一行的注释。
    // app.use(AV.Cloud.HttpsRedirect());
  }

  router(routes: (app: Application) => void): ExpressServer {
    swaggerify(app, routes)
    return this;
  }

  listen(port: number = parseInt(process.env.PORT)): Application {
    const welcome = (PORT) => (err) => {
      console.log('Node app is running on port:', PORT);

      // 注册全局未捕获异常处理器
      process.on('uncaughtException', function (err) {
        console.error('Caught exception:', err.stack);
      });
      process.on('unhandledRejection', function (reason, p) {
        console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack);
      });
    };
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
}