import { dbConnect } from './db.connect.js';
import mongoose from 'mongoose';

jest.mock('mongoose');
jest.mock('../config.js', () => ({
  __dirname: 'test',
  config: {
    secret: 'test',
  },
}));
describe('Given a dbconnect function', () => {
  dbConnect();

  describe('When its called', () => {
    test('Then it should call the mongoose.connect method', () => {
      expect(mongoose.connect).toHaveBeenCalled();
    });
  });
});
