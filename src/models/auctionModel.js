const pool = require('../../config/database');
const bidModel = require('../models/bidModel.js');
const escrowModel = require('../models/escrowModel.js');

class AuctionModel {
    static async create(auctionData) {
      const {item_id, end_time} = auctionData;
      const query = `
        INSERT INTO auctions (item_id, end_time)
        VALUES ($1, $2)
        RETURNING *
      `;
      const result = await pool.query(query, [item_id, end_time]);
      return result.rows[0];
    }
  
    static async findActive() {
      const query = `
        SELECT a.*, i.item_name, i.min_bid, i.sold, i.description, u.user_id, u.avg_rating
        FROM auctions a
        JOIN items i ON a.item_id = i.item_id
        JOIN users u on i.user_id = u.user_id
      `;
      const result = await pool.query(query);
      return result.rows;
    }

    static async getAuction(auction_id) {
      const query = `
        SELECT a.*, i.item_name, i.min_bid, u.user_id
        FROM auctions a
        JOIN items i ON a.item_id = i.item_id
        JOIN users u on i.user_id = u.user_id
        where a.auction_id = ${auction_id};
      `;
      const result = await pool.query(query);
      return result.rows;
    }

    static async setInActive(auction_id){
      const res0 = await this.getAuction(auction_id);
      if(res0['status'] == 'closed'){
        return;
      }
      console.log(auction_id + ` auction id `)
      const res = await bidModel.getHighestBid(auction_id);
      console.log(res)
      const winning_bid_id = res[0] != null 
      ? res[0]['bid_id'] : null;
      
      
      console.log(res);
      const query = `
      UPDATE auctions SET status = 'closed', winning_bid_id = $1 WHERE auction_id = $2
      returning status;
      `;
      const result = await pool.query(query, [winning_bid_id, auction_id]);
      const bid_amount = res[0]['bid_amount'];
      const buyer_id = res[0]['buyer_id'];
      await escrowModel.transferToEscrow({auction_id, winning_bid_id, buyer_id, bid_amount});

      return result.rows[0];
    }

    static async confirmArrival(auction_id){
      const result = await escrowModel.releasePayment(auction_id);
      return result.rows[0];
    }
}
  
module.exports = AuctionModel;