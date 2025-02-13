const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Add this line
const { sequelize } = require('../../config');
const User = require('../models/User');

// Signup route (existing code with minor improvements)
router.post('/signup', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { username, password, firstName, lastName, email } = req.body;
    
    // Validate input
    if (!username || !password || !firstName || !lastName || !email) {
      await transaction.rollback();
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check username exists
    const existingUser = await User.findOne({ where: { username }, transaction });
    if (existingUser) {
      await transaction.rollback();
      return res.status(409).json({ error: 'Username exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with explicit transaction
    const newUser = await User.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email
    }, { transaction });

    await transaction.commit();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return res.status(201).json({
      message: 'User created',
      user: newUser,
      token
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Add login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '14d' }
    );

    // Send user data (excluding password)
    const userData = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    res.json({ 
      message: "Login successful", 
      token,
      user: userData
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

module.exports = router;
