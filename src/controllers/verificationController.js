const pool = require("../../config/database");

// Create a new verification record
const createVerification = async (req, res) => {
  const { cnic, fullname, ph_number, user_id } = req.body;

  // Validate input
  if (!cnic || !fullname || !ph_number || !user_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const query = `
      INSERT INTO verification (cnic, fullname, ph_number, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [cnic, fullname, ph_number, user_id];
    const { rows } = await pool.query(query, values);

    res.status(201).json({ message: "Verification created successfully", data: rows[0] });
  } catch (error) {
    console.error("Error creating verification:", error);
    res.status(500).json({ error: "Failed to create verification" });
  }
};

const getVerificationReq = async (req, res) => {
    try {
      const query = `
        select * from verification;
      `;
      const result = await pool.query(query);
  
      res.status(201).json(result.rows);
    } catch (error) {
      console.error("Error getting verification:", error);
      res.status(500).json({ error: "Failed to get verification" });
    }
  };

const verify = async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const query = `
          update users 
          set verification = 'verified'
          where user_id = $1;
        `;
        const result = await pool.query(query, [user_id]);
    
        res.status(201).json(result.rows);
      } catch (error) {
        console.error("Error verifying:", error);
        res.status(500).json({ error: "Failed to verify" });
      }
  };
module.exports = { createVerification, getVerificationReq, verify };
