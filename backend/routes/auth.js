const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  console.log("Register route hit");  
  const { username, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/test', (req, res) => {
  console.log("Test route hit");
  res.send("OK");
});

// Login user
// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request for:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("No user found for email:", email);
      return res.status(400).json({ message: 'Email invalid' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: 'Password invalid' });
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.encode(payload, process.env.JWT_SECRET);

    console.log("Login successful for:", email);
    res.json({
      token,
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;