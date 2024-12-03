const  BidModel  = require('../models/bidModel.js');
const UserRepository = require('../models/userModel.js');
const ItemModel = require('../models/itemModels');

class BidController {
  static async placeBid(req, res) {
    const{user_id, item_id, bid_amount, auction_id} = req.body;
    try {
      const user = await UserRepository.findById(user_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Check if the user has enough money in their wallet
      if (user['wallet'] < bid_amount) {
        return res.status(400).json({ error: 'Insufficient wallet balance to place the bid.' });
      }
  
      // Fetch the item and the current highest bid
      const item = await ItemModel.findById(item_id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found.' });
      }
      else if(item['user_id'] == user_id){
        return res.status(400).json({ error: 'Seller Cannot Bid on his own auction.' });
      }
      else if(item['min_bid'] > bid_amount){
        console.log(item['min_bid'] + " " + bid_amount);
        return res.status(400).json({ error: 'Cannot bid below minimun' });
      }
      const currentHighestBid = await BidModel.getHighestBid(auction_id);
      console.log('hello my name is jeff');
      console.log(currentHighestBid[0]);
      console.log(bid_amount +" "+ currentHighestBid[0]['bid_amount']);

    // Ensure the bid is higher than the current highest bid
    if (currentHighestBid != null && bid_amount <= currentHighestBid[0]['bid_amount']) {
      return res.status(400).json({ error: 'Bid must be higher than the current highest bid.' });
    }
    console.log(currentHighestBid.rows[0]);
      const bidData = {
        ...req.body,
        buyer_id: user_id,
        bid_amount: bid_amount,
        auction_id: auction_id        
      };
      const bid = await BidModel.create(bidData);
      res.status(201).json(bid);
    } catch (error) {
      res.status(400).json({ error: error.message });
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