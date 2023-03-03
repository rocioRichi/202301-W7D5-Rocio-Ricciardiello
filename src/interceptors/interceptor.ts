import createDebug from 'debug';
import { Thing } from '../entities/thing';
import { User } from '../entities/user';
import { Repo } from '../repository/repo.interface';
import { RequestPlus } from './logged';
import { Response, NextFunction } from 'express';
import { HTTPError } from '../errors/errors';
import { Auth } from '../services/auth';

const debug = createDebug('w6:interceptor');

export class Interceptor {
  constructor(public thingsRepo: Repo<Thing>, public repoUsers: Repo<User>) {
    debug('Instantiate');
  }

  async authorized(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('Called');
      if (!req.info)
        throw new HTTPError(
          498,
          'Token not found',
          'Token not found in Authorized interceptor'
        );
      // Tengo el id de usuario (req.info.id)
      const userId = req.info.id;
      // Tengo el id de la cosa (req.params.id)
      const thingId = req.params.id;
      // Busco la cosa

      const thing = await this.thingsRepo.queryId(thingId);
      // Comparo cosa.owner.id con userId (req.info.id)
      debug('Thing', thing.owner);
      debug('User', userId);
      if (thing.owner.id !== userId)
        throw new HTTPError(401, 'Not authorized', 'Not authorized');
      next();
    } catch (error) {
      next(error);
    }
  }

  logged(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('Called');
      const authHeader = req.get('Authorization');
      if (!authHeader)
        throw new HTTPError(498, 'Token invalid', 'Not value in auth header');
      if (!authHeader.startsWith('Bearer'))
        throw new HTTPError(498, 'Token invalid', 'Not Bearer in auth header');
      const token = authHeader.slice(7);
      const payload = Auth.verifyJWTGettingPayload(token);
      req.info = payload;
      next();
    } catch (error) {
      next(error);
    }
  }
}
