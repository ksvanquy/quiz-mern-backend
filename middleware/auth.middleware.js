const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Xác thực JWT
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded.userId).select('-password');
    if(!req.user) return res.status(401).json({ message: 'User không tồn tại' });

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
};

// Phân quyền theo role
const authorize = (roles = []) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    }
    next();
  }
};

module.exports = { authenticate, authorize };
