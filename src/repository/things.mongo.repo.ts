import { Thing } from '../entities/thing';
import { HTTPError } from '../errors/errors.js';
import { Repo } from './repo.interface';
import { ThingModel } from './things.mongo.model.js';
import createDebug from 'debug';
const debug = createDebug('W6:repo:things');

export class ThingsMongoRepo implements Repo<Thing> {
  private static instance: ThingsMongoRepo;

  public static getInstance(): ThingsMongoRepo {
    if (!ThingsMongoRepo.instance) {
      ThingsMongoRepo.instance = new ThingsMongoRepo();
    }

    return ThingsMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiate');
  }

  async query(): Promise<Thing[]> {
    debug('query');
    const data = await ThingModel.find()
      .populate('owner', { things: 0 })
      .exec();
    return data;
  }

  async queryId(id: string): Promise<Thing> {
    debug('queryId');
    const data = await ThingModel.findById(id)
      .populate('owner', { things: 0 })
      .exec();
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in queryId');
    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<Thing[]> {
    debug('search');
    const data = await ThingModel.find({ [query.key]: query.value })
      .populate('owner', { things: 0 })
      .exec();
    return data;
  }

  async create(info: Partial<Thing>): Promise<Thing> {
    debug('create');
    const data = (await ThingModel.create(info)).populate('owner', {
      things: 0,
    });
    return data;
  }

  async update(info: Partial<Thing>): Promise<Thing> {
    debug('update');
    const data = await ThingModel.findByIdAndUpdate(info.id, info, {
      new: true,
    })
      .populate('owner', { things: 0 })
      .exec();
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in update');
    return data;
  }

  async destroy(id: string): Promise<void> {
    debug('destroy');
    const data = await ThingModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(404, 'Not found', 'Delete not posible: id not found');
  }
}
