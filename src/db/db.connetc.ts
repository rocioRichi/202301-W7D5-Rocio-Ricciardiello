import mongoose from 'mongoose';
import { config } from '../config.js';

const { user, passwd, cluster, dbName } = config;

export const dbConnect = () => {
  const uri = `mongodb+srv://${user}:${passwd}@${cluster}/${dbName}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
