import { NextFunction, Response } from 'express';
import { RequestPlus } from './logged.js';
import createDebug from 'debug';
import { ThingsMongoRepo } from '../repository/things.mongo.repo.js';
import { HTTPError } from '../errors/errors.js';
const debug = createDebug('W6:interceptor:authorized');
export async function authorized(
  req: RequestPlus,
  resp: Response,
  next: NextFunction,
  thingsRepo: ThingsMongoRepo
) {
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

    const thing = await thingsRepo.queryId(thingId);
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
