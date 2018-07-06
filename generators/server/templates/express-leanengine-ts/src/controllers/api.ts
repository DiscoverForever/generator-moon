'use strict';

import async from 'async';
import request from 'request';
import { Response, Request, NextFunction } from 'express';


/**
 * GET /api
 * List of API examples.
 */
export let getMainpage = (req: Request, res: Response) => {
  res.render('index', {
    currentTime: Date.now(),
    title: 'API Examples'
  });
};
