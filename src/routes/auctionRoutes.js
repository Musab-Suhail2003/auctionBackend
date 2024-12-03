const express = require('express');
const router = express.Router();
const AuctionController = require('../controllers/auctionController.js');
const auth = require('../middleware/auth');
const verification = require('../middleware/verification.js');

router.post('/', auth, verification, AuctionController.create);
router.get('/active', AuctionController.getActive);
router.get('/:auction_id', AuctionController.getAuction);
router.get('/end/:auction_id', auth, AuctionController.endAuction);
router.get('/end/releasepayment/:auction_id', auth, AuctionController.releaseEscrow);

module.exports = router;