const { AuctionModel } = require('../models/auctionModel');

class AuctionController {
  static async create(req, res) {
    try {
      const auction = await AuctionModel.create(req.body);
      res.status(201).json(auction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getActive(req, res) {
    try {
      const auctions = await AuctionModel.findActive();
      res.json(auctions);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getAuction(req, res) {
    try {
        const auction = await AuctionModel.getAuction(req.params.id);
        if (!auction) {
            return res.status(404).json({ error: 'Auction not found' });
        }
        res.json(auction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
}

module.exports = AuctionController;
