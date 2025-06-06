import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { AppError } from '../middleware/errorHandler';
import { StatusCodes } from 'http-status-codes';
import { getBaseUrl } from '../utils/url';

export class UserController {
  constructor(private userModel: UserModel) {}

  private createHateoasLinks(userId: number, baseUrl: string) {
    return {
      self: { href: `${baseUrl}/api/v1/users/${userId}` },
      posts: { href: `${baseUrl}/api/v1/users/${userId}/posts` },
      update: { href: `${baseUrl}/api/v1/users/${userId}`, method: 'PUT' },
      delete: { href: `${baseUrl}/api/v1/users/${userId}`, method: 'DELETE' }
    };
  }

  async getUsers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sort_by as string) || 'created_at';
    const order = (req.query.order as string)?.toUpperCase() || 'DESC';

    const { users, total } = await this.userModel.findAll(page, limit, sortBy, order);
    
    const baseUrl = getBaseUrl(req);
    const usersWithLinks = users.map(user => ({
      ...user,
      _links: this.createHateoasLinks(user.id, baseUrl)
    }));

    res.status(StatusCodes.OK).json({
      data: usersWithLinks,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      },
      _links: {
        self: { href: `${baseUrl}/api/v1/users?page=${page}&limit=${limit}` },
        next: page < Math.ceil(total / limit) ? 
          { href: `${baseUrl}/api/v1/users?page=${page + 1}&limit=${limit}` } : null,
        prev: page > 1 ? 
          { href: `${baseUrl}/api/v1/users?page=${page - 1}&limit=${limit}` } : null
      }
    });
  }

  async getUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    const baseUrl = getBaseUrl(req);
    res.status(StatusCodes.OK).json({
      data: {
        ...user,
        _links: this.createHateoasLinks(user.id, baseUrl)
      }
    });
  }

  async createUser(req: Request, res: Response) {
    const { username, email } = req.body;
    const user = await this.userModel.create(username, email);

    const baseUrl = getBaseUrl(req);
    res.status(StatusCodes.CREATED).json({
      data: {
        ...user,
        _links: this.createHateoasLinks(user.id, baseUrl)
      }
    });
  }

  async updateUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const { username, email } = req.body;
    
    const user = await this.userModel.update(userId, username, email);
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    const baseUrl = getBaseUrl(req);
    res.status(StatusCodes.OK).json({
      data: {
        ...user,
        _links: this.createHateoasLinks(user.id, baseUrl)
      }
    });
  }

  async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const deleted = await this.userModel.delete(userId);
    
    if (!deleted) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.NO_CONTENT).send();
  }
} 