import db from '../config/database';

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export class PostModel {
  async findAll(page: number = 1, limit: number = 10, sortBy: string = 'created_at', order: string = 'DESC'): Promise<{ posts: Post[], total: number }> {
    const offset = (page - 1) * limit;
    const validSortColumns = ['id', 'title', 'created_at', 'updated_at'];
    const validOrders = ['ASC', 'DESC'];
    
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = validOrders.includes(order) ? order : 'DESC';

    const posts = db.prepare(`
      SELECT * FROM posts 
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `).all(limit, offset) as Post[];

    const total = db.prepare('SELECT COUNT(*) as total FROM posts')
      .get() as { total: number };

    return { posts, total: total.total };
  }

  async findById(id: number): Promise<Post | null> {
    const post = db.prepare('SELECT * FROM posts WHERE id = ?')
      .get(id) as Post | undefined;
    return post || null;
  }

  async findByTitle(title: string): Promise<Post[]> {
    const posts = db.prepare(
      'SELECT * FROM posts WHERE title LIKE ? ORDER BY created_at DESC'
    ).all(`%${title}%`) as Post[];
    return posts;
  }

  async findByContent(content: string): Promise<Post[]> {
    const posts = db.prepare(
      'SELECT * FROM posts WHERE content LIKE ? ORDER BY created_at DESC'
    ).all(`%${content}%`) as Post[];
    return posts;
  }

  async findLatest(limit: number = 10): Promise<Post[]> {
    const posts = db.prepare(
      'SELECT * FROM posts ORDER BY created_at DESC LIMIT ?'
    ).all(limit) as Post[];
    return posts;
  }

  async findMostCommented(limit: number = 10): Promise<Post[]> {
    const posts = db.prepare(`
      SELECT p.*, COUNT(c.id) as comment_count 
      FROM posts p 
      LEFT JOIN comments c ON p.id = c.post_id 
      GROUP BY p.id 
      ORDER BY comment_count DESC 
      LIMIT ?
    `).all(limit) as Post[];
    return posts;
  }
} 