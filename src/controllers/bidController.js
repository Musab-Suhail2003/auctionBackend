const { BidModel } = require('../models/bidModel');

class BidController {
  static async placeBid(req, res) {
    try {
      const bidData = {
        ...req.body,
        buyer_id: req.user.id
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