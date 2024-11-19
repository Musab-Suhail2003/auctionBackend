const pool = require('../../config/database');

class ItemModel {
  async findAll() {
    const result = await pool.query(
      `SELECT i.*, c.category_name, array_agg(img.image_id) as images
       FROM items i
       LEFT JOIN "Categories" c ON i.category_id = c.category_id
       LEFT JOIN images img ON i.item_id = img.item_id
       GROUP BY i.item_id, c.category_name`
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT i.*, c.category_name
       FROM items i
       LEFT JOIN "Categories" c ON i.category_id = c.category_id
       LEFT JOIN images img ON i.item_id = img.item_id
       WHERE i.item_id = $1
       GROUP BY i.item_id, c.category_name`,
      [id]
    );
    return result.rows[0];
  }

  async findByName(name){
    const result = await pool.query(
        `SELECT i.*, c.category_name
         FROM items i
         LEFT JOIN "Categories" c ON i.category_id = c.category_id
         LEFT JOIN images img ON i.item_id = img.item_id
         WHERE i.item_name = $1
         GROUP BY i.item_id, c.category_name`,
        [name]
      );
    return result.rows[0];
  }

  async create(item, images) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { name, description, min_bid, category_id } = item;
      
      const itemResult = await client.query(
        `INSERT INTO items (item_name, description, min_bid, category_id)
         VALUES ($1, $2, $3, $4) RETURNING item_id`,
        [name, description, min_bid, category_id]
      );
      
      if (images && images.length > 0) {
        const imageValues = images.map(image => (
          `('${image}', ${itemResult.rows[0].item_id}, NOW())`
        )).join(',');
        
        await client.query(
          `INSERT INTO images (image_name, item_id, uploaded_at)
           VALUES ${imageValues}`
        );
      }
      
      await client.query('COMMIT');
      return itemResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new ItemModel();