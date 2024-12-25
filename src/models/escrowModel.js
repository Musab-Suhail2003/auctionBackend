// models/bidModel.js
const pool = require("../../config/database");

class escrowModel {
  static async transferToEscrow(bidData) {
    const { auction_id, winning_bid_id, buyer_id, bid_amount } = bidData;
    console.log(bidData);
  
    const client = await pool.connect();
  
    try {
      // Start the transaction
      await client.query('BEGIN');
  
      // Insert into escrow
      const escrowQuery = `
        INSERT INTO escrow (auction_id, buyer_id, seller_id, amount, completed)
        SELECT
          a.auction_id,
          b.buyer_id,
          t.user_id,
          b.bid_amount,
          'f'
        FROM
          auctions a
          JOIN items t ON t.item_id = a.item_id
          JOIN bids b ON a.auction_id = b.auction_id
        WHERE
          a.auction_id = $1
          AND b.bid_id = $2
        RETURNING *;
      `;
      const escrowResult = await client.query(escrowQuery, [auction_id, winning_bid_id]);
  
      // Update user wallet
      const walletQuery = `
        UPDATE users
        SET wallet = wallet - $1
        WHERE user_id = $2
        RETURNING *;
      `;
      const walletResult = await client.query(walletQuery, [bid_amount, buyer_id]);
  
      // Commit the transaction
      await client.query('COMMIT');
  
      console.log(walletResult);
      return escrowResult.rows[0];
    } catch (error) {
      // Rollback the transaction in case of error
      await client.query('ROLLBACK');
      console.error('Error in transferToEscrow:', error);
      throw error;
    } finally {
      // Always release the client back to the pool
      client.release();
    }
  }
  
  static async releasePayment(item_id) {
    const client = await pool.connect();
  
    try {
      // Start the transaction
      await client.query('BEGIN');
  
      // Update seller's wallet and get payment details
      const paymentQuery = `
        UPDATE users u
        SET wallet = wallet + e.amount
        FROM escrow e
        JOIN auctions a ON a.auction_id = e.auction_id
        JOIN items i ON i.item_id = a.item_id
        WHERE e.item_id = $1
        RETURNING 
          e.amount, 
          e.escrow_id, 
          i.user_id AS seller_id;

      `;
      const paymentResult = await client.query(paymentQuery, [item_id]);
  
      // Log the results for debugging
      console.log('Payment Result:', {
        rowCount: paymentResult.rows.length,
        rows: paymentResult.rows
      });
  
      // Check if payment result is empty
      if (paymentResult.rows.length === 0) {
        throw new Error(`No payment found for auction ${auction_id}`);
      }
  
      // Mark escrow as completed
      const escrowUpdateQuery = `
        UPDATE escrow 
        SET completed = 't'
        WHERE auction_id = $1
        RETURNING *
      `;
      const escrowResult = await client.query(escrowUpdateQuery, [auction_id]);
  
      // Log the escrow results
      console.log('Escrow Result:', {
        rowCount: escrowResult.rows.length,
        rows: escrowResult.rows
      });

      const itemUpdate = `
        UPDATE items i
        SET sold = 't'
        FROM escrow e
        JOIN auctions a ON a.auction_id = e.auction_id
        WHERE i.item_id = a.item_id
          AND e.auction_id = $1
        RETURNING i.item_id;
      `;
      const itemResult = await client.query(itemUpdate, [auction_id]);
  
      // Log the escrow results
      console.log('item update Result:', {
        rowCount: itemResult.rows.length,
        rows: escrowResult.rows
      });
  
      // Commit the transaction
      await client.query('COMMIT');
  
      // Return the first payment row
      return paymentResult;
    } catch (error) {
      // Rollback the transaction in case of error
      await client.query('ROLLBACK');
      console.error('Error in releasePayment:', error);
      throw error;
    } finally {
      // Always release the client back to the pool
      client.release();
    }
  }

  static async reverseEscrowTransfer(auction_id) {
    const client = await pool.connect();

    try {
        // Start the transaction
        await client.query('BEGIN');

        // Get escrow details
        const escrowQuery = `
            SELECT amount, buyer_id, seller_id
            FROM escrow
            WHERE auction_id = $1
            AND completed = 'f'
        `;
        const escrowResult = await client.query(escrowQuery, [auction_id]);

        if (escrowResult.rows.length === 0) {
            throw new Error(`No pending escrow found for auction ${auction_id}`);
        }

        const { amount, buyer_id, seller_id } = escrowResult.rows[0];

        // Reverse the transfer by updating the buyer's and seller's wallets
        const reverseWalletQuery = `
            UPDATE users
            SET wallet = wallet + $2
            WHERE user_id = $1
        `;
        await client.query(reverseWalletQuery, [buyer_id, amount]);

        // Delete the escrow record
        const deleteEscrowQuery = `
          DELETE FROM escrow
          WHERE auction_id = $1
          AND completed = 'f'
        `;
        await client.query(deleteEscrowQuery, [auction_id]);

        // Commit the transaction
        await client.query('COMMIT');

        return { message: 'Escrow transfer reversed successfully' };
    } catch (error) {
        // Rollback the transaction in case of error
        await client.query('ROLLBACK');
        console.error('Error in reverseEscrowTransfer:', error);
        throw error;
    } finally {
        // Always release the client back to the pool
        client.release();
    }
}

  static async getEscrowStatus(){

  }
}

module.exports = escrowModel;