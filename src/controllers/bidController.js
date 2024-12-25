const  BidModel  = require('../models/bidModel.js');
const UserRepository = require('../models/userModel.js');
const ItemModel = require('../models/itemModels');

class BidController {
  static async placeBid(req, res) {
    const { user_id, item_id, bid_amount, auction_id } = req.body;
  
    try {
      // Fetch user details
      const user = await UserRepository.findById(user_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Check wallet balance
      if (user.wallet < bid_amount) {
        return res.status(400).json({ error: 'Insufficient wallet balance to place the bid.' });
      }
  
      // Fetch item details
      const item = await ItemModel.findById(item_id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found.' });
      }
      if (item.user_id == user_id) {
        return res.status(400).json({ error: 'Seller cannot bid on their own auction.' });
      }
      if (item.min_bid > bid_amount) {
        return res.status(400).json({ error: 'Cannot bid below minimum bid.' });
      }
  
      // Fetch the current highest bid
      const currentHighestBid = (await BidModel.getHighestBid(auction_id))[0];
  
      if (currentHighestBid && currentHighestBid.length > 0) {
        const highestBidAmount = currentHighestBid[0].bid_amount;
        if (bid_amount <= highestBidAmount) {
          return res.status(400).json({ error: 'Bid must be higher than the current highest bid.' });
        }
      }
  
      // Create the bid
      const bidData = {
        ...req.body,
        buyer_id: user_id,
        bid_amount: bid_amount,
        auction_id: auction_id
      };
      const bid = await BidModel.create(bidData);
      res.status(201).json(bid);
  
    } catch (error) {
      console.error('Error placing bid:', error);
      res.status(500).json({ error: error.message });
    }
  }
  

  static async getHighestBid(req, res, ) {
    try {
      const bid = await BidModel.getHighestBid(req.params.auction_id);
      res.json(bid);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getBids(req, res){
    try {
      const bid = await BidModel.getUsersBids(req.params.user_id);
      res.json(bid);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = BidController;