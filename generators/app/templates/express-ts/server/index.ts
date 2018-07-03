import './common/env';
import Server from './common/server';
import routes from './routes';
import('../entities/cloud-import');
import('../entities/statemachine-import');

// 端口一定要从环境变量 `LEANCLOUD_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || '3000');
export default new Server()
  .router(routes)
  .listen(PORT);
