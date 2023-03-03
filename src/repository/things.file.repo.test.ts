import { ThingsFileRepo } from './things.file.repo';
import fs from 'fs/promises';
jest.mock('fs/promises');

describe('Given ThingsFileRepo', () => {
  // Arrange
  const repo = new ThingsFileRepo();
  test('Then it could be instantiated', () => {
    expect(repo).toBeInstanceOf(ThingsFileRepo);
  });

  describe('When I use query', () => {
    test('Then should return the data', async () => {
      // Arrange
      (fs.readFile as jest.Mock).mockResolvedValue('[]');
      // Act
      const result = await repo.query();
      // Assert
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When I use queryID', () => {
    test('Then it should return an object if it has a valid id', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[{"id": "1"}]');
      const id = '1';
      const result = await repo.queryId(id);
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
    test('Then it should throw an error if it has a NO valid id', () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[{"id": "2"}]');
      const id = '1';
      expect(async () => repo.queryId(id)).rejects.toThrow();
      expect(fs.readFile).toHaveBeenCalled();
    });
  });
});
