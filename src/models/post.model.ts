import db from '../config/database';

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export class PostModel {
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

  async findByIdAndUserId(id: number, userId: number): Promise<Post | null> {
    const post = db.prepare('SELECT * FROM posts WHERE id = ? AND user_id = ?')
      .get(id, userId) as Post | undefined;
    return post || null;
  }

  async createForUser(userId: number, title: string, content: string): Promise<Post> {
    const result = db.prepare(`
      INSERT INTO posts (user_id, title, content)
      VALUES (?, ?, ?)
    `).run(userId, title, content);

    return this.findByIdAndUserId(result.lastInsertRowid as number, userId) as Promise<Post>;
  }

  async updateByIdAndUserId(id: number, userId: number, title: string, content: string): Promise<Post | null> {
    const result = db.prepare(`
      UPDATE posts 
      SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(title, content, id, userId);

    if (result.changes === 0) {
      return null;
    }

    return this.findByIdAndUserId(id, userId);
  }

  async deleteByIdAndUserId(id: number, userId: number): Promise<boolean> {
    const result = db.prepare('DELETE FROM posts WHERE id = ? AND user_id = ?')
      .run(id, userId);
    return result.changes > 0;
  }
} 