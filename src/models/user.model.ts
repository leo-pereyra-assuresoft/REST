import db from '../config/database';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Post } from './post.model';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export class UserModel {
  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    const initSql = readFileSync(join(__dirname, '../db/init.sql'), 'utf-8');
    db.exec(initSql);
  }

  async findAll(page: number = 1, limit: number = 10, sortBy: string = 'created_at', order: string = 'DESC'): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const users = db.prepare(`
      SELECT * FROM users 
      ORDER BY ${sortBy} ${order}
      LIMIT ? OFFSET ?
    `).all(limit, offset) as User[];

    const total = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };

    return { users, total: total.count };
  }

  async findById(id: number): Promise<User | null> {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
    return user || null;
  }

  async create(username: string, email: string): Promise<User> {
    const result = db.prepare(`
      INSERT INTO users (username, email)
      VALUES (?, ?)
    `).run(username, email);

    return this.findById(result.lastInsertRowid as number) as Promise<User>;
  }

  async update(id: number, username: string, email: string): Promise<User | null> {
    const result = db.prepare(`
      UPDATE users 
      SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(username, email, id);

    if (result.changes === 0) {
      return null;
    }

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return result.changes > 0;
  }

  async findAllByUserId(userId: number, page: number = 1, limit: number = 10, sortBy: string = 'created_at', order: string = 'DESC'): Promise<{ posts: Post[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const posts = db.prepare(`
      SELECT * FROM posts 
      WHERE user_id = ?
      ORDER BY ${sortBy} ${order}
      LIMIT ? OFFSET ?
    `).all(userId, limit, offset) as Post[];

    const total = db.prepare('SELECT COUNT(*) as count FROM posts WHERE user_id = ?')
      .get(userId) as { count: number };

    return { posts, total: total.count };
  }

  async findAllPosts(id: number, userId: number): Promise<Post | null> {
    const post = db.prepare('SELECT * FROM posts WHERE id = ? AND user_id = ?')
      .get(id, userId) as Post | undefined;
    return post || null;
  }

  async createPost(userId: number, title: string, content: string): Promise<Post> {
    const result = db.prepare(`
      INSERT INTO posts (user_id, title, content)
      VALUES (?, ?, ?)
    `).run(userId, title, content);

    return this.findAllPosts(result.lastInsertRowid as number, userId) as Promise<Post>;
  }
} 