import express from 'express';
import compression from 'compression';  // compresses requests
import session from 'express-session';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import path from 'path';
import expressValidator from 'express-validator';
import AV from 'leanengine';
import route from './controllers';
import('./entities/cloud-import');
import('./entities/statemachine-import');

// Create Express server
const app = express();


// Express configuration
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(compression());
// 加载云引擎中间件
app.use(AV.express());
app.enable('trust proxy');
// 需要重定向到 HTTPS 可去除下一行的注释。
// app.use(AV.Cloud.HttpsRedirect());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);
app.use('/', (req: any, res: any) => {
  res.render('index.ejs', {});
});
route(app);
export default app;