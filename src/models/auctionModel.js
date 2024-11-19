class AuctionModel {
    static async create(auctionData) {
      const { item_id, start_time, end_time, status } = auctionData;
      const query = `
        INSERT INTO auctions (item_id, start_time, end_time, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result = await pool.query(query, [item_id, start_time, end_time, status]);
      return result.rows[0];
    }
  
    static async findActive() {
      const query = `
        SELECT a.*, i.item_name, i.min_bid
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
        SELECT a.*, i.item_name, i.min_bid
        FROM auctions a
        JOIN items i ON a.item_id = i.item_id
        a.status = 'active'

        UPATE AUCTIONS SET status = 'closed' where auction_id = ${auction_id};
      `;
      const result = await pool.query(query);
      return result.rows;
    }
  }
  