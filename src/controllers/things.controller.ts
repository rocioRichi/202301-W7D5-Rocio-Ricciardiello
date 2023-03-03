import { Response, Request, NextFunction } from 'express';

import { Repo } from '../repository/repo.interface.js';
import { Thing } from '../entities/thing.js';
import createDebug from 'debug';
import { RequestPlus } from '../interceptors/logged.js';
import { User } from '../entities/user.js';
import { HTTPError } from '../errors/errors.js';
const debug = createDebug('W6:controller:things');

export class ThingsController {
  constructor(public repo: Repo<Thing>, public repoUsers: Repo<User>) {
    debug('Instantiate');
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');
      const data = await this.repo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get');
      const data = await this.repo.queryId(req.params.id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async post(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('post');
      const userId = req.info?.id;
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user id');
      const actualUser = await this.repoUsers.queryId(userId); // Repo throw error if not found
      req.body.owner = userId;
      const newThing = await this.repo.create(req.body);
      // Option bidireccional
      actualUser.things.push(newThing);
      this.repoUsers.update(actualUser);
      resp.json({
        results: [newThing],
      });
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('patch');
      req.body.id = req.params.id ? req.params.id : req.body.id;
      const data = await this.repo.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('delete');
      await this.repo.destroy(req.params.id);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
