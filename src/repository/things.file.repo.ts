import fs from 'fs/promises';
import { Repo } from './repo.interface';
import { Thing } from '../entities/thing';
import createDebug from 'debug';
const debug = createDebug('W6:repo:things');

const file = './data/data.json';

export class ThingsFileRepo implements Repo<Thing> {
  constructor() {
    debug('Instantiate');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  search(_query: { key: string; value: unknown }): Promise<Thing[]> {
    throw new Error('Method not implemented.');
  }

  async query(): Promise<Thing[]> {
    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });
    return JSON.parse(initialData);
  }

  async queryId(id: string): Promise<Thing> {
    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });
    const data: Thing[] = JSON.parse(initialData);
    const finalData = data.find((item) => item.id === id);
    if (!finalData) throw new Error('Id not found');
    return finalData;
  }

  async create(info: Partial<Thing>): Promise<Thing> {
    // Future if (!validateInfo(info)) throw new Error('Not valid data');
    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });
    const data: Thing[] = JSON.parse(initialData);
    info.id = String(Math.floor(Math.random() * 1000_000));
    const finalData = [...data, info];
    await fs.writeFile(file, JSON.stringify(finalData), 'utf-8');
    return info as Thing;
  }

  async update(info: Partial<Thing>): Promise<Thing> {
    if (!info.id) throw new Error('Not valid data');
    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });
    const data: Thing[] = JSON.parse(initialData);
    let updatedItem: Thing = {} as Thing;
    const finalData = data.map((item) => {
      if (item.id === info.id) {
        updatedItem = { ...item, ...info };
        return updatedItem;
      }

      return item;
    });

    if (!updatedItem.id) throw new Error('Id not found');
    await fs.writeFile(file, JSON.stringify(finalData), 'utf-8');
    return updatedItem as Thing;
  }

  async destroy(id: string): Promise<void> {
    const initialData: string = await fs.readFile(file, {
      encoding: 'utf-8',
    });
    const data: Thing[] = JSON.parse(initialData);
    const index = data.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Id not found');
    data.slice(index, 1);
    await fs.writeFile(file, JSON.stringify(data), 'utf-8');
  }
}
