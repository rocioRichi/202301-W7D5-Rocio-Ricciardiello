import { User } from './user';

export type Thing = {
  id: string;
  name: string;
  interestingScore: number;
  importantScore: number;
  owner: User;
};
