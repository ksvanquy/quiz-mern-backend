const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if(existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'Đăng ký thành công', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'Email không tồn tại' });

    const isMatch = await user.comparePassword(password);
    if(!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Đăng nhập thành công', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if(!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
    try {
      const updates = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
      if (!user) return res.status(404).json({ message: 'User không tồn tại' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // Delete user (admin only)
  exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: 'User không tồn tại' });
      res.json({ message: 'User đã bị xóa' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
