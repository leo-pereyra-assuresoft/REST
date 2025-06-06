import { Request, Response } from 'express';
import { PostModel, Post } from '../models/post.model';
import { AppError } from '../middleware/errorHandler';
import { StatusCodes } from 'http-status-codes';
import { getBaseUrl } from '../utils/url';

export class PostController {
  constructor(private postModel: PostModel) {}

  private createHateoasLinks(postId: number, baseUrl: string) {
    return {
      self: { href: `${baseUrl}/api/v1/posts/${postId}` },
      update: { href: `${baseUrl}/api/v1/posts/${postId}`, method: 'PUT' },
      delete: { href: `${baseUrl}/api/v1/posts/${postId}`, method: 'DELETE' }
    };
  }

  async getAllPosts(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sort_by as string) || 'created_at';
    const order = (req.query.order as string)?.toUpperCase() || 'DESC';

    const { posts, total } = await this.postModel.findAll(page, limit, sortBy, order);
    
    const baseUrl = getBaseUrl(req);
    const postsWithLinks = posts.map((post: Post) => ({
      ...post,
      _links: this.createHateoasLinks(post.id, baseUrl)
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
        self: { href: `${baseUrl}/api/v1/posts?page=${page}&limit=${limit}` },
        next: page < Math.ceil(total / limit) ? 
          { href: `${baseUrl}/api/v1/posts?page=${page + 1}&limit=${limit}` } : null,
        prev: page > 1 ? 
          { href: `${baseUrl}/api/v1/posts?page=${page - 1}&limit=${limit}` } : null
      }
    });
  }

  async getPostById(req: Request, res: Response) {
    const postId = parseInt(req.params.id);
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new AppError('Post not found', StatusCodes.NOT_FOUND);
    }

    const baseUrl = getBaseUrl(req);
    res.status(StatusCodes.OK).json({
      data: {
        ...post,
        _links: this.createHateoasLinks(post.id, baseUrl)
      }
    });
  }

  async searchPostsByTitle(req: Request, res: Response) {
    const title = req.query.title as string;
    const posts = await this.postModel.findByTitle(title);

    const baseUrl = getBaseUrl(req);
    const postsWithLinks = posts.map((post: Post) => ({
      ...post,
      _links: this.createHateoasLinks(post.id, baseUrl)
    }));

    res.status(StatusCodes.OK).json({
      data: postsWithLinks
    });
  }

  async searchPostsByContent(req: Request, res: Response) {
    const content = req.query.content as string;
    const posts = await this.postModel.findByContent(content);

    const baseUrl = getBaseUrl(req);
    const postsWithLinks = posts.map((post: Post) => ({
      ...post,
      _links: this.createHateoasLinks(post.id, baseUrl)
    }));

    res.status(StatusCodes.OK).json({
      data: postsWithLinks
    });
  }

  async getLatestPosts(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await this.postModel.findLatest(limit);

    const baseUrl = getBaseUrl(req);
    const postsWithLinks = posts.map((post: Post) => ({
      ...post,
      _links: this.createHateoasLinks(post.id, baseUrl)
    }));

    res.status(StatusCodes.OK).json({
      data: postsWithLinks
    });
  }

  async getMostCommentedPosts(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await this.postModel.findMostCommented(limit);

    const baseUrl = getBaseUrl(req);
    const postsWithLinks = posts.map((post: Post) => ({
      ...post,
      _links: this.createHateoasLinks(post.id, baseUrl)
    }));

    res.status(StatusCodes.OK).json({
      data: postsWithLinks
    });
  }
} 
