const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(auth);
router.get('/', itemController.getAllItems);
router.get('/:item_id', itemController.getItem);
router.get('/:user_id', itemController.getUserItems);
router.post('/additem', upload.array('images'), itemController.createItem);

module.exports = router;