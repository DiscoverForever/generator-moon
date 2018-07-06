// Controllers (route handlers)
import * as apiController from './api';

export default function(app: any) {
  /**
   * API examples routes.
   */
  app.get('/', apiController.getMainpage);
}