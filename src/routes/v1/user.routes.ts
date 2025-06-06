import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { UserController } from '../../controllers/user.controller';
import { validateRequest } from '../../middleware/validate-request';
import pool from '../../config/database';
import { UserModel } from '../../models/user.model';

const router = Router();
const userModel = new UserModel(pool);
const userController = new UserController(userModel);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 */
router.get('/',
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sort_by').optional().isIn(['id', 'username', 'email', 'created_at', 'updated_at']),
  query('order').optional().isIn(['ASC', 'DESC']),
  validateRequest,
  (req, res) => userController.getUsers(req, res)
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id',
  param('id').isInt({ min: 1 }),
  validateRequest,
  (req, res) => userController.getUserById(req, res)
);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 */
router.post('/',
  body('username').trim().isLength({ min: 3, max: 50 }),
  body('email').trim().isEmail(),
  validateRequest,
  (req, res) => userController.createUser(req, res)
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user
 *     parameters:
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 */
router.put('/:id',
  param('id').isInt({ min: 1 }),
  body('username').optional().trim().isLength({ min: 3, max: 50 }),
  body('email').optional().trim().isEmail(),
  validateRequest,
  (req, res) => userController.updateUser(req, res)
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/:id',
  param('id').isInt({ min: 1 }),
  validateRequest,
  (req, res) => userController.deleteUser(req, res)
);

export default router; 