const jwt = require('jsonwebtoken');
require('dotenv').config();

const authAdmin = (req, res, next) => {

  // Get token from cookies
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  // Check if the provided token is a match
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

    // Check if the user is an admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: Admins only' });
    }

    req.user = decoded; // Attach user data to the request object
    next();
  });
};

module.exports = authAdmin;