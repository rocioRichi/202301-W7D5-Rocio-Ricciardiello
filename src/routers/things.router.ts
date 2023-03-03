import { Router } from 'express';
import { ThingsController } from '../controllers/things.controller.js';
import { ThingsMongoRepo } from '../repository/things.mongo.repo.js';
import { logged } from '../interceptors/logged.js';
import { authorized } from '../interceptors/authorized.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';
import createDebug from 'debug';
// Alt import { Interceptor } from '../interceptors/interceptor.js';
const debug = createDebug('W6:router:things');

// eslint-disable-next-line new-cap
export const thingsRouter = Router();
debug('loaded');
// File Repo previous const repo = new ThingsFileRepo();
const repoThings = ThingsMongoRepo.getInstance();
const repoUsers = UsersMongoRepo.getInstance();
const controller = new ThingsController(repoThings, repoUsers);
// Alt const interceptor = new Interceptor(repoThings, repoUsers);

thingsRouter.get('/', controller.getAll.bind(controller));
thingsRouter.get('/:id', controller.get.bind(controller));
thingsRouter.post('/', logged, controller.post.bind(controller));
thingsRouter.patch(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, repoThings),
  controller.patch.bind(controller)
);
thingsRouter.delete(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, repoThings),
  controller.delete.bind(controller)
);
