
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next(); 
  } catch (err) {
    console.error('❌ JWT Verification Failed:', err.message);
    res.status(401).json({ error: 'Token is not valid' });
  }
};
