import { Pool } from 'pg';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  constructor(private pool: Pool) {}

  async findAll(page = 1, limit = 10, sortBy = 'created_at', order = 'DESC'): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    const countQuery = 'SELECT COUNT(*) FROM users';
    const query = `
      SELECT * FROM users 
      ORDER BY ${sortBy} ${order}
      LIMIT $1 OFFSET $2
    `;

    const [countResult, result] = await Promise.all([
      this.pool.query(countQuery),
      this.pool.query(query, [limit, offset])
    ]);

    return {
      users: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(username: string, email: string): Promise<User> {
    const query = `
      INSERT INTO users (username, email, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *
    `;
    const result = await this.pool.query(query, [username, email]);
    return result.rows[0];
  }

  async update(id: number, username: string, email: string): Promise<User | null> {
    const query = `
      UPDATE users 
      SET username = $1, email = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    const result = await this.pool.query(query, [username, email, id]);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
} 