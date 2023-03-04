// import { NextFunction, Response } from 'express';
// import { RequestPlus } from './logged.js';
// import createDebug from 'debug';
// import { HTTPError } from '../errors/errors.js';
// import { UsersMongoRepo } from '../repository/users.mongo.repo.js';
// const debug = createDebug('W6:interceptor:authorized');
// export async function authorized(
//   req: RequestPlus,
//   resp: Response,
//   next: NextFunction,
//   usesrsRepo: UsersMongoRepo
// ) {
//   try {
//     debug('Called');
//     if (!req.info)
//       throw new HTTPError(
//         498,
//         'Token not found',
//         'Token not found in Authorized interceptor'
//       );
//     // Tengo el id de usuario (req.info.id)
//     const userIdbybody = req.info.id;
//     // Tengo el id de la cosa (req.params.id)
//     const userId = req.params.id;
//     // Busco la cosa

//     const user = await UsersMongoRepo.queryId();
//     // Comparo cosa.owner.id con userId (req.info.id)
//     debug('user', user.owner);
//     debug('User', userId);
//     if (user.owner.id !== userId)
//       throw new HTTPError(401, 'Not authorized', 'Not authorized');
//     next();
//   } catch (error) {
//     next(error);
//   }
// }
