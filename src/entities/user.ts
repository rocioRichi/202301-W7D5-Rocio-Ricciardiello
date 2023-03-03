import { Thing } from './thing';

export type User = {
  id: string;
  email: string;
  passwd: string;
  things: Thing[];
  // Add favorites management
  // favorites: Thing[];
};
