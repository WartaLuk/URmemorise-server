const db = require("../config/db");

class Comment {
  static async create(photoId, userId, text) {
    const sql = `
            INSERT INTO comments (photoId, userId, text, createdAt)
            VALUES (?, ?, ?, ?)
        `;
    const { lastID } = await db.run(sql, [photoId, userId, text, new Date()]);
    return lastID;
  }

  static async update(commentId, userId, isAdmin, text) {
    const comment = await this.findById(commentId);
    if (!comment || (comment.userId !== userId && !isAdmin)) {
      throw new Error("Unauthorized");
    }

    const sql = `
            UPDATE comments
            SET text = ?
            WHERE id = ?
        `;
    await db.run(sql, [text, commentId]);
  }

  static async delete(commentId, userId, isAdmin) {
    const comment = await this.findById(commentId);
    if (!comment || (comment.userId !== userId && !isAdmin)) {
      throw new Error("Unauthorized");
    }

    const sql = `
            DELETE FROM comments
            WHERE id = ?
        `;
    await db.run(sql, [commentId]);
  }

  static async findById(id) {
    const sql = `
            SELECT * FROM comments
            WHERE id = ?
        `;
    const comment = await db.get(sql, [id]);
    return comment;
  }
}

module.exports = Comment;
