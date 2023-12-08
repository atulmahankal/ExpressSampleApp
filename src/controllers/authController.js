// /src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const proceedForLogin = (req, res, user) => {
  const userId = user._id;
  const acceptHeader = req.get('Accept');
  
  // Check if the client accepts JSON
  if (acceptHeader && acceptHeader.includes('application/json')) {
    const token = generateToken(userId);
    res.status(200).json({ userId, token });
  } else {
    // Set the session expiration based on the "Remember Me" option
    if(req.body.remember){
      req.session.cookie.maxAge = (30 * 24 * 60 * 60 * 1000); // 30 days for "Remember Me"
    }
    // Set session variables
    req.session.user = user;

    // Redirect to the originally requested URL or the default '/' if not set
    const returnTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(returnTo);
  }
};

exports.register = async (req, res) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({ username, password: hashedPassword });

    // If the user is not created, return an error
    if (!user) {
      throw new Error('Unable to create user');
    }
    
    // Proceed for login
    proceedForLogin(req, res, user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // If the user is not found, return an error
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Proceed for login
    proceedForLogin(req, res, user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
