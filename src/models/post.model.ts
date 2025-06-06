import { Pool } from 'pg';

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export class PostModel {
  constructor(private pool: Pool) {}

  async findAllByUserId(userId: number, page = 1, limit = 10, sortBy = 'created_at', order = 'DESC'): Promise<{ posts: Post[]; total: number }> {
    const offset = (page - 1) * limit;
    const countQuery = 'SELECT COUNT(*) FROM posts WHERE user_id = $1';
    const query = `
      SELECT * FROM posts 
      WHERE user_id = $1
      ORDER BY ${sortBy} ${order}
      LIMIT $2 OFFSET $3
    `;

    const [countResult, result] = await Promise.all([
      this.pool.query(countQuery, [userId]),
      this.pool.query(query, [userId, limit, offset])
    ]);

    return {
      posts: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Post | null> {
    const query = 'SELECT * FROM posts WHERE id = $1 AND user_id = $2';
    const result = await this.pool.query(query, [id, userId]);
    return result.rows[0] || null;
  }

  async createForUser(userId: number, title: string, content: string): Promise<Post> {
    const query = `
      INSERT INTO posts (user_id, title, content, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
    `;
    const result = await this.pool.query(query, [userId, title, content]);
    return result.rows[0];
  }

  async updateByIdAndUserId(id: number, userId: number, title: string, content: string): Promise<Post | null> {
    const query = `
      UPDATE posts 
      SET title = $1, content = $2, updated_at = NOW()
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `;
    const result = await this.pool.query(query, [title, content, id, userId]);
    return result.rows[0] || null;
  }

  async deleteByIdAndUserId(id: number, userId: number): Promise<boolean> {
    const query = 'DELETE FROM posts WHERE id = $1 AND user_id = $2';
    const result = await this.pool.query(query, [id, userId]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
} 