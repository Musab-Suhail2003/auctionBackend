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
  
  async allCategories(){
    console.log('getting all categories');
    const result = await pool.query(
      `SELECT category_id, category_name from "Categories"`
    );
    return result.rows;
  }

  async getCategorybyID(id){
    const result = await pool.query(
      `SELECT * from "Categories" where category_id = $1`, [id]
    );
    return result.rows;
  }

  async findAllFromUser(user_id) {
    const result = await pool.query(
      `SELECT i.*, c.category_name, array_agg(img.image_url) as images
       FROM items i
       LEFT JOIN "Categories" c ON i.category_id = c.category_id
       LEFT JOIN images img ON i.item_id = img.item_id
       WHERE i.user_id = $1
       GROUP BY i.item_id, c.category_name;`, [user_id]
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
         WHERE i.item_name ilike $1
         GROUP BY i.item_id, c.category_name`,
        [name + "%"]
      );
    return result.rows[0];
  }

  async create(item, images) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { user_id, item_name, description, min_bid, category_id } = item;
      
      const itemResult = await client.query(
        `INSERT INTO items (user_id, item_name, description, min_bid, category_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING item_id`,
        [user_id, item_name, description, min_bid, category_id]
      );
      
      if (images && images.length > 0) {
        const imageValues = images.map(image => (
          `('${image}', ${itemResult.rows[0].item_id}, NOW())`
        )).join(',');
        
        await client.query(
          `INSERT INTO images (image_name, image_data, item_id)
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