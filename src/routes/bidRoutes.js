const express = require('express');
const router = express.Router();
const BidController = require('../controllers/bidController');
const auth = require('../middleware/auth');
const verification = require('../middleware/verification');

const upload = require('../middleware/upload');

router.get('/:auction_id', BidController.getHighestBid);
router.get('/mybids/:user_id', auth, BidController.getBids);

router.post('/placebid', auth, verification, BidController.placeBid);

module.exports = router;

