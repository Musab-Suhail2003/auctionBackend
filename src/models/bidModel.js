// models/bidModel.js
class BidModel {
    static async create(bidData) {
      const { auction_id, buyer_id, bid_amount } = bidData;
      const query = `
        INSERT INTO bids (auction_id, buyer_id, bid_amount, bid_time)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
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
        LIMIT 1
      `;
      const result = await pool.query(query, [auctionId]);
      return result.rows[0];
    }
  }