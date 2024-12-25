const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const auth = require('../middleware/auth');


router.use(auth);
router.get('/getCategori', itemController.getAllCategories);
router.get('/', auth ,itemController.getAllItems);
router.get('/:item_id', itemController.getItem);
router.get('/ofuser/:user_id', itemController.getUserItems);
router.post('/additem', itemController.createItem);
router.get('/getCategory/:id', itemController.getCategoriesbyID);

module.exports = router;