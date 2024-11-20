const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // Ensure JWT_SECRET is defined in your environment variables

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Bearer header
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, secretKey); // Verify the token
    req.user = decoded; // Attach the decoded payload (userId, etc.) to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

