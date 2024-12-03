const pool = require("../../config/database");

class imageModel {
    static async upload(imageData) {
      const {image_name, image_data, item_data } = imageData;
      
      const query = `
        INSERT INTO images (image_name, image_data, item_data)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await pool.query(query, [image_name, image_data, item_data]);
      return result.rows[0];
    }
  
    static async retrieve(itemId) {
      const query = `
        SELECT *
        FROM images
        WHERE item_id = $1
        ORDER BY image_id DESC
      `;
      const result = await pool.query(query, [itemId]);
      return result.rows;
    }
}

module.exports = imageModel;