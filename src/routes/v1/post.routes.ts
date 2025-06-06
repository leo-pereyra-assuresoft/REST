import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { PostController } from '../../controllers/post.controller';
import { PostModel } from '../../models/post.model';
import { validateRequest } from '../../middleware/validate-request';
import pool from '../../config/database';

const router = Router();
const postModel = new PostModel(pool);
const postController = new PostController(postModel);

/**
 * @swagger
 * /api/v1/users/{userId}/posts:
 *   get:
 *     summary: Get all posts for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 */
router.get('/',
  param('userId').isInt({ min: 1 }),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sort_by').optional().isIn(['id', 'title', 'created_at', 'updated_at']),
  query('order').optional().isIn(['ASC', 'DESC']),
  validateRequest,
  (req, res) => postController.getPostsByUserId(req, res)
);

/**
 * @swagger
 * /api/v1/users/{userId}/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id',
  param('userId').isInt({ min: 1 }),
  param('id').isInt({ min: 1 }),
  validateRequest,
  (req, res) => postController.getPostByIdAndUserId(req, res)
);

/**
 * @swagger
 * /api/v1/users/{userId}/posts:
 *   post:
 *     summary: Create a new post
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 */
router.post('/',
  param('userId').isInt({ min: 1 }),
  body('title').trim().isLength({ min: 3, max: 100 }),
  body('content').trim().isLength({ min: 10 }),
  validateRequest,
  (req, res) => postController.createPostForUser(req, res)
);

/**
 * @swagger
 * /api/v1/users/{userId}/posts/{id}:
 *   put:
 *     summary: Update a post
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 */
router.put('/:id',
  param('userId').isInt({ min: 1 }),
  param('id').isInt({ min: 1 }),
  body('title').optional().trim().isLength({ min: 3, max: 100 }),
  body('content').optional().trim().isLength({ min: 10 }),
  validateRequest,
  (req, res) => postController.updatePostByIdAndUserId(req, res)
);

/**
 * @swagger
 * /api/v1/users/{userId}/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/:id',
  param('userId').isInt({ min: 1 }),
  param('id').isInt({ min: 1 }),
  validateRequest,
  (req, res) => postController.deletePostByIdAndUserId(req, res)
);

export default router; 