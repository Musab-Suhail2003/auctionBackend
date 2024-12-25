const UserModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config/config');
const pool = require('../../config/database.js');
const verification = require('../middleware/verification.js');

class UserController {
  static async register(req, res) {
    try {
      const { email, user_name, password } = req.body;
      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);

      if (existingUser) {
        console.log(`${existingUser.email}`);
        return res.status(400).json({ error: 'Email already registered' });
      }
      // Create new user
      const u = await UserModel.create({
        email,
        user_name,
        password
      });
      console.log(u);
      
      // Generate JWT token
      const token = jwt.sign({userId: u.user_id}, config.jwtSecret, { expiresIn: '24h' });


      return res.status(201).json({
        message: 'Registration successful',
        user: {
          user_id: u.user_id,
          email: u.email,
          user_name: u.user_name,
          created_at: u.created_at,
          verification: u.verification
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await UserModel.findByEmail(email);
      
      console.log(user.email + " " + user.pass);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.pass);
      //const isValidPassword = password == user.pass
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign({ userId: user.user_id }, config.jwtSecret, { expiresIn: '24h' });

      res.json({
        message: 'Login successful',
        user: {
          user_id: user.user_id,
          email: user.email,
          user_name: user.user_name,
          wallet: user.wallet,
          verification: user.verification,

        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static async getProfile(req, res) {
    try {
      console.log(`before find by id ${req.params.user_id}`);
      const user = await UserModel.findById(req.params.user_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user_id: user.user_id,
        email: user.email,
        user_name: user.user_name,
        wallet: user.wallet,
        avg_rating: user.avg_rating,
        created_at: user.created_at
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { user_name, email } = req.body;
      const updatedUser = await UserModel.update(req.user.id, { user_name, email });
      
      res.json({
        message: 'Profile updated successfully',
        user: {
          user_id: updatedUser.user_id,
          email: updatedUser.email,
          user_name: updatedUser.user_name
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  static async updateWallet(req, res) {
    try {
      const { amount, user_id } = req.body;
      console.log(amount + " " + user_id);
      const query = 'UPDATE users SET wallet = wallet + $1 WHERE user_id = $2 RETURNING wallet, user_name, user_id;';
      const result = await pool.query(query, [amount, user_id]);
      
      res.json({...result.rows[0],
        message: 'Wallet updated successfully'      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update wallet' });
    }
  }

  static async updateRating(req, res) {
    try {
      const { rating, user_id } = req.body;
      console.log(rating + " " + user_id);
      const result = await UserController.updateRating([rating, user_id]);
      
      res.json({...result.rows[0],
        message: 'rating updated successfully'      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update rating' });
    }
  }

  static async verify(req, res) {
    try {
      const { user_id } = req.body;
      console.log(user_id);
      const result = await UserModel.verify(user_id);
      
      res.json({...result.rows[0],
        message: 'User verified successfully'      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify user' });
    }
  }
}

module.exports = UserController;
