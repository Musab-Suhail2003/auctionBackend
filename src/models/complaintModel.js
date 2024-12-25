const pool = require('../../config/database.js'); // Assume you have a configured pool for PostgreSQL

class ComplaintModel {
  // Create a new complaint
  static async createComplaint(complaintText) {
    const query = `
      INSERT INTO complaints (complaint)
      VALUES ($1)
      RETURNING complaint_id, complaint, time;
    `;
    const values = [complaintText];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get all complaints
  static async getAllComplaints() {
    const query = 'SELECT * FROM complaints ORDER BY created_at DESC;';
    const result = await pool.query(query);
    return result.rows;
  }

  // Get a complaint by ID
  static async getComplaintById(complaintId) {
    const query = 'SELECT * FROM complaints WHERE complaint_id = $1;';
    const result = await pool.query(query, [complaintId]);
    return result.rows[0];
  }

  // Delete a complaint by ID
  static async resolveComplaint(complaintId) {
    const query = `update table complaints set resolved = 't' WHERE complaint_id = $1 RETURNING *;`;
    const result = await pool.query(query, [complaintId]);
    return result.rows[0];
  }
}

module.exports = ComplaintModel;
