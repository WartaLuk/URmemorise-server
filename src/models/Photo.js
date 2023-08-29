const sharp = require("sharp");
const db = require("../config/db");

class Photo {
  static async create(userId, imageBuffer, description) {
    const imagePath = `../../uploads/photos/${Date.now()}.jpg`;

    await sharp(imageBuffer)
      .toFormat("jpg")
      .jpeg({ quality: 90 })
      .toFile(imagePath);

    const sql = `
            INSERT INTO photos (userId, imagePath, description, createdAt)
            VALUES (?, ?, ?, ?)
        `;
    const { lastID } = await db.run(sql, [
      userId,
      imagePath,
      description,
      new Date(),
    ]);
    return lastID;
  }

  static async update(photoId, userId, isAdmin, updatedFields) {
    const photo = await this.findById(photoId);
    if (!photo || (photo.userId !== userId && !isAdmin)) {
      throw new Error("Unauthorized");
    }

    const updates = [];
    const values = [];

    for (const key in updatedFields) {
      updates.push(`${key} = ?`);
      values.push(updatedFields[key]);
    }
    values.push(photoId);

    const sql = `
            UPDATE photos
            SET ${updates.join(", ")}
            WHERE id = ?
        `;
    await db.run(sql, values);
  }

  static async delete(photoId, userId, isAdmin) {
    const photo = await this.findById(photoId);
    if (!photo || (photo.userId !== userId && !isAdmin)) {
      throw new Error("Unauthorized");
    }

    const sql = `
            DELETE FROM photos
            WHERE id = ?
        `;
    await db.run(sql, [photoId]);
  }

  static async findById(id) {
    const sql = `
            SELECT * FROM photos
            WHERE id = ?
        `;
    const photo = await db.get(sql, [id]);
    return photo;
  }

  static async findAll() {
    const sql = "SELECT * FROM photos";
    const photos = await db.all(sql);
    return photos;
  }
}

module.exports = Photo;
