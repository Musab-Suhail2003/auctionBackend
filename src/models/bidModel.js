// models/bidModel.js
const pool = require("../../config/database");

class BidModel {
    static async create(bidData) {
      const { auction_id, buyer_id, bid_amount } = bidData;
      
      const query = `
        INSERT INTO bids (auction_id, buyer_id, bid_amount)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await pool.query(query, [auction_id, buyer_id, bid_amount]);
      return result.rows[0];
    }
  
    static async getHighestBid(auctionId) {
      const query = `
        SELECT *
        FROM bids
        WHERE auction_id = $1
        ORDER BY bid_amount DESC
        LIMIT 2
      `;
      const result = await pool.query(query, [auctionId]);
      return result.rows;
    }

    static async getUsersBids(user_id) {
      const query = `
        SELECT *
        FROM bids
        WHERE buyer_id = $1
        ORDER BY bid_amount DESC
      `;
      const result = await pool.query(query, [user_id]);
      return result.rows;
    }
}

module.exports = BidModel;