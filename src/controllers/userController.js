const UserRepository = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config/config');

class UserController {
  static async register(req, res) {
    try {
      const { email, user_name, password } = req.body;
      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(email);

      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create new user
      const user = await UserModel.create({
        email,
        user_name,
        password,
      });

      // Generate JWT token
      const token = jwt.sign({userId: user_id}, config.jwtSecret, { expiresIn: '24h' });


      res.status(201).json({
        message: 'Registration successful',
        user: {
          user_id: user.user_id,
          email: user.email,
          user_name: user.user_name,
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.pass);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign({ userId: user.user_id }, config.jwtSecret, { expiresIn: '244h' });

      res.json({
        message: 'Login successful',
        user: {
          user_id: user.user_id,
          email: user.email,
          user_name: user.user_name,
          wallet_money: user.wallet
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
      const user = await UserModel.findById(req.user_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user_id: user.user_id,
        email: user.email,
        user_name: user.user_name,
        wallet_money: user.wallet_money,
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
      const updatedUser = await UserRepository.update(req.user.id, { user_name, email });
      
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
      const { amount } = req.body;
      const updatedUser = await UserRepository.updateWallet(req.user.id, amount);
      
      res.json({
        message: 'Wallet updated successfully',
        wallet_money: updatedUser.wallet_money
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update wallet' });
    }
  }
}

module.exports = UserController;
