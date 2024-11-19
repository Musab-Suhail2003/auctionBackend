const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', itemController.getAllItems);
router.get('/:item_id', itemController.getItem);
router.post('/', auth, upload.array('images'), itemController.createItem);

module.exports = router;