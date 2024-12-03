const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage});

router.use(auth);
// API endpoint to retrieve image by ID
router.get('/:item_id', async (req, res) => {
    const item_id = req.params.id;
  
    try {
      // Query to get the image by ID
      const result = await pool.query('SELECT image_data FROM images WHERE item_id = $1', [item_id]);
  
      if (result.rows.length > 0) {
        const imageData = result.rows
        res.status(200).send(imageData);  // Send image byte data as response
      } else {
        res.status(404).json({ message: 'Image not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving image' });
    }
  });
router.post('/upload', upload.array('image'), async (req, res) => {
    const { image_name, image_data, item_id } = req.file;  // Get image name and byte buffer
  
    try {
      // Insert the image into the database
      const query = 'INSERT INTO images (image_name, image_data, item_id) VALUES ($1, $2, $3) RETURNING *';
      const result = await pool.query(query, [image_name, image_data, item_id]);
  
      res.status(200).json({ message: 'Image uploaded successfully', images: result.rows});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading image' });
    }
});
  

module.exports = router;