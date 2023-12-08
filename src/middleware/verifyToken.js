// /src/middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  const authToken = token.substring(7); // Remove 'Bearer ' prefix

  try {
    // Verify the token
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);


		
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user; // Store user information in the request object
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;
