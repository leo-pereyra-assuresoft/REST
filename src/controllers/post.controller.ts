import { Request, Response } from 'express';
import { PostModel } from '../models/post.model';
import { AppError } from '../middleware/errorHandler';
import { StatusCodes } from 'http-status-codes';
import { getBaseUrl } from '../utils/url';

export class PostController {
  constructor(private postModel: PostModel) {}

  private createHateoasLinks(postId: number, userId: number, baseUrl: string) {
    return {
      self: { href: `${baseUrl}/api/v1/users/${userId}/posts/${postId}` },
      user: { href: `${baseUrl}/api/v1/users/${userId}` },
      update: { href: `${baseUrl}/api/v1/users/${userId}/posts/${postId}`, method: 'PUT' },
      delete: { href: `${baseUrl}/api/v1/users/${userId}/posts/${postId}`, method: 'DELETE' }
    };
  }

  async getPostsByUserId(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sort_by as string) || 'created_at';
    const order = (req.query.order as string)?.toUpperCase() || 'DESC';

    const { posts, total } = await this.postModel.findAllByUserId(userId, page, limit, sortBy, order);
    
    const baseUrl = getBaseUrl(req);
    const postsWithLinks = posts.map(post => ({
      ...post,
      _links: this.createHateoasLinks(post.id, userId, baseUrl)
    }));

    res.status(StatusCodes.OK).json({
      data: postsWithLinks,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      },
      _links: {
        self: { href: `${baseUrl}/api/v1/users/${userId}/posts?page=${page}&limit=${limit}` },
        next: page < Math.ceil(total / limit) ? 
          { href: `${baseUrl}/api/v1/users/${userId}/posts?page=${page + 1}&limit=${limit}` } : null,
        prev: page > 1 ? 
          { href: `${baseUrl}/api/v1/users/${userId}/posts?page=${page - 1}&limit=${limit}` } : null
      }
    });
  }

  async getPostByIdAndUserId(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    const postId = parseInt(req.params.id);
    const post = await this.postModel.findByIdAndUserId(postId, userId);

    if (!post) {
      throw new AppError('Post not found', StatusCodes.NOT_FOUND);
    }

    const baseUrl = getBaseUrl(req);
    res.status(StatusCodes.OK).json({
      data: {
        ...post,
        _links: this.createHateoasLinks(post.id, userId, baseUrl)
      }
    });
  }

  async createPostForUser(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    const { title, content } = req.body;
    const post = await this.postModel.createForUser(userId, title, content);

    const baseUrl = getBaseUrl(req);
    res.status(StatusCodes.CREATED).json({
      data: {
        ...post,
        _links: this.createHateoasLinks(post.id, userId, baseUrl)
      }
    });
  }

  async updatePostByIdAndUserId(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;
    
    const post = await this.postModel.updateByIdAndUserId(postId, userId, title, content);
    if (!post) {
      throw new AppError('Post not found', StatusCodes.NOT_FOUND);
    }

    const baseUrl = getBaseUrl(req);
    res.status(StatusCodes.OK).json({
      data: {
        ...post,
        _links: this.createHateoasLinks(post.id, userId, baseUrl)
      }
    });
  }

  async deletePostByIdAndUserId(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    const postId = parseInt(req.params.id);
    const deleted = await this.postModel.deleteByIdAndUserId(postId, userId);
    
    if (!deleted) {
      throw new AppError('Post not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.NO_CONTENT).send();
  }
} 
