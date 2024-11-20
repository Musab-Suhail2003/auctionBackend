const pool = require('../../config/database');

class AuctionModel {
    static async create(auctionData) {
      const {item_id} = auctionData;
      const query = `
        INSERT INTO auctions (item_id)
        VALUES ($1)
        RETURNING *
      `;
      const result = await pool.query(query, [item_id]);
      return result.rows[0];
    }
  
    static async findActive() {
      const query = `
        SELECT a.*, i.item_name, i.min_bid, i.description
        FROM auctions a
        JOIN items i ON a.item_id = i.item_id
        where a.status = 'open';
      `;
      const result = await pool.query(query);
      return result.rows;
    }

    static async getAuction(auction_id) {
      const query = `
        SELECT a.*, i.item_name, i.min_bid
        FROM auctions a
        JOIN items i ON a.item_id = i.item_id
        where a.auction_id = ${auction_id};
      `;
      const result = await pool.query(query);
      return result.rows;
    }

    static async setInActive(auction_id){
      const query = `
        UPATE AUCTIONS SET status = 'closed' and end_time = CURRENT_TIMESTAMP where auction_id = ${auction_id};
      `;
      const result = await pool.query(query);
      return result.rows;
    }
  }
  
module.exports = AuctionModel;