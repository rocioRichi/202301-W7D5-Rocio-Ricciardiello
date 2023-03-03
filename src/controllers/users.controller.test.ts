import { Request, Response } from 'express';
import { User } from '../entities/user';
import { Repo } from '../repository/repo.interface';
import { UsersController } from './users.controller';
import { Auth } from '../services/auth.js';

jest.mock('../services/auth.js');

describe('Given register method from UsersController', () => {
  const mockRepo = {
    create: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<User>;
  const controller = new UsersController(mockRepo);

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  describe('When there are NOT password in th body', () => {
    const req = {
      body: {
        email: 'test',
      },
    } as Request;
    test('Then next should been called', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When there are NOT email in th body', () => {
    const req = {
      body: {
        passwd: 'test',
      },
    } as Request;
    test('Then next should been called', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When there are NOT email and NOT passwd in th body', () => {
    const req = {
      body: {},
    } as Request;
    test('Then next should been called', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When all is OK ', () => {
    const req = {
      body: {
        email: 'test',
        passwd: 'test',
      },
    } as Request;
    test('Then json should been called', async () => {
      await controller.register(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
  });
});

describe('Given login method from UsersController', () => {
  const mockRepo = {
    create: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(mockRepo);

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const req = {
    body: {
      email: 'test',
      passwd: 'test',
    },
  } as Request;

  const next = jest.fn();

  Auth.compare = jest.fn().mockResolvedValue(true);

  describe('When ALL is OK', () => {
    (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
    test('Then json should be called', async () => {
      await controller.login(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
  });
});
