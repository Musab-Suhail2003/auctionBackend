const express = require('express');
const router = express.Router();
const BidController = require('../controllers/bidController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/:bid_id', BidController.getHighestBid);
router.post('/', auth, BidController.placeBid);

module.exports = router;

