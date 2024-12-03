const AuctionModel = require('../models/auctionModel.js');

class AuctionController {
  static async create(req, res) {
    try {
      console.log('sadjoiashdiosajdoiasjd');
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
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
  static async getAuction(req, res) {
    try {
        const auction = await AuctionModel.getAuction(req.params.auction_id);
        if (!auction) {
            return res.status(404).json({ error: 'Auction not found' });
        }
        res.json(auction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  }

  static async endAuction(req,res){
    try {
        const auction = await AuctionModel.setInActive(req.params.auction_id);
        if (!auction) {
            return res.status(404).json({ error: 'Auction not found' });
        }
        res.json(auction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  }

  static async releaseEscrow(req, res){
    try {
      const auction = await AuctionModel.confirmArrival(req.params.auction_id);
      if (!auction) {
          return res.status(404).json({ error: 'Escrow Record Not found' });
      }
      res.json(auction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AuctionController;
