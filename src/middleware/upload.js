const express = require('express');
const multer = require('multer');
const pool = require('../../config/database');

const router = express.Router();

// Configure Multer to store files locally
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// API to handle multiple file uploads
router.post('/upload', upload.array('pictures', 10), async (req, res) => {
    const { image_name, item_id } = req.body;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    try {
        const client = await pool.connect();

        // Insert each file into the database
        const fileData = req.files.map(file => [item_id, file.path]);
        const query = `
            INSERT INTO pictures (image_name item_id, image_url)
            VALUES ($1, $2, $3) RETURNING *;
        `;

        const insertedPictures = [];
        for (const file of req.files) {
            const result = await client.query(query, [image_name, item_id, file.path]);
            insertedPictures.push(result.rows[0]);
        }

        client.release();

        res.json({ message: 'Files uploaded successfully', pictures: insertedPictures });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload pictures' });
    }
});

router.get('/pictures/:entity_id', async (req, res) => {
  const { entity_id } = req.params;

  try {
      const result = await pool.query('SELECT * FROM pictures WHERE item_id = $1', [entity_id]);
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve pictures' });
  }
});


module.exports = router;
