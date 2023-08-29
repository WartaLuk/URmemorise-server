const db = require("../config/db");
const { isValidPassword, emailExists, handleExists } = require("./validation");

class User {
  static async create(username, email, password, handle) {
    if (await emailExists(email)) {
      throw new Error("E-mail already exists");
    }

    if (await handleExists(handle)) {
      throw new Error("Handle already exists");
    }

    if (!isValidPassword(password)) {
      throw new Error("Invalid password");
    }

    const sql = `
            INSERT INTO users (username, email, password, handle)
            VALUES (?, ?, ?, ?)
        `;
    await db.run(sql, [username, email, password, handle]);
  }

  static async findById(id) {
    const sql = `
            SELECT * FROM users
            WHERE id = ?
        `;
    const user = await db.get(sql, [id]);
    return user;
  }

  static async findByEmail(email) {
    const sql = `
            SELECT * FROM users
            WHERE email = ?
        `;
    const user = await db.get(sql, [email]);
    return user;
  }

  static async findByHandle(handle) {
    const sql = `
            SELECT * FROM users
            WHERE handle = ?
        `;
    const user = await db.get(sql, [handle]);
    return user;
  }

  static async update(id, updatedFields) {
    const updates = [];
    const values = [];

    for (const key in updatedFields) {
      updates.push(`${key} = ?`);
      values.push(updatedFields[key]);
    }

    values.push(id);

    const sql = `
            UPDATE users
            SET ${updates.join(", ")}
            WHERE id = ?
        `;
    await db.run(sql, values);
  }

  static async delete(id) {
    const sql = `
            DELETE FROM users
            WHERE id = ?
        `;
    await db.run(sql, [id]);
  }
}

module.exports = User;
