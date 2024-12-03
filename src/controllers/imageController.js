const imageModel = require('../models/imageModel.js');

class imageController {
    static async saveImage(res, req) {
      const { originalname, buffer } = req.file; 
        try {
          const result = await imageModel.upload(req.body);
          return result.rows[0].id;
        } catch (error) {
          throw new Error('Error saving image to database');
        }
      }
    
      // Get image by ID
      static async getImageByItemId(item_id) {
        try {
          const result = await imageModel.retrieve(req.params.id);
          if (result.rows.length === 0) {
            return null;
          }
          return result.rows[0];
        } catch (error) {
          throw new Error('Error fetching image from database');
        }
      }
}

module.exports = imageController;