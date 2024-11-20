const pool = require('../../config/database');

class CategoryModel {
    static async getAuctionsbyCategory(category_id){
        const result = pool.query(
            `SELECT 
                a.auction_id,
                a.item_id,
                i.item_name,
                i.category_id,
                a.start_time,
                a.end_time,
                a.status
            FROM 
                auctions a
            JOIN 
                items i ON a.item_id = i.item_id
            WHERE 
                i.category_id = $1                      
                AND a.status = 'open';`, [category_id] 
        );
    }
}