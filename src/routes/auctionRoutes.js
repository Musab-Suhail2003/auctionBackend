const express = require('express');
const router = express.Router();
const AuctionController = require('../controllers/auctionController.js');
const auth = require('../middleware/auth');

router.post('/', auth, AuctionController.create);
router.get('/active', AuctionController.getActive);
router.get('/:auction_id', AuctionController.getAuction);

module.exports = router;