const  BidModel  = require('../models/bidModel');
const UserRepository = require('../models/userModel.js');

class BidController {
  static async placeBid(req, res) {
    const{user_id, item_id, amount} = req.body;
    try {
      const user = await UserRepository.findById(user_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Check if the user has enough money in their wallet
      if (user.wallet < bidAmount) {
        return res.status(400).json({ error: 'Insufficient wallet balance to place the bid.' });
      }
  
      // Fetch the item and the current highest bid
      const item = await ItemModel.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Item not found.' });
      }
      const currentHighestBid = await BidModel.getHighestBid(itemId);

    // Ensure the bid is higher than the current highest bid
    if (currentHighestBid && bidAmount <= currentHighestBid.bid_amount) {
      return res.status(400).json({ error: 'Bid must be higher than the current highest bid.' });
    }

      const bidData = {
        ...req.body,
        buyer_id: user_id,
        bid_amount: amount,
        auction_id: req.auction_id        
      };
      const bid = await BidModel.create(bidData);
      res.status(201).json(bid);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getHighestBid(req, res) {
    try {
      const bid = await BidModel.getHighestBid(req.params.auctionId);
      res.json(bid);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = BidController;