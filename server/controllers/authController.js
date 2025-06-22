const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("📥 Register Request Body:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || 'user' 
    });

    console.log("🛠️ New User (before save):", newUser);

    await newUser.save();

    console.log("✅ User saved successfully");

    res.status(201).json({ message: '✅ User registered successfully' });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

 
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('❌ Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
try {
const userId = req.user._id; 
const { name, email, password } = req.body;

const user = await User.findById(userId);
if (!user) return res.status(404).json({ message: 'User not found' });

if (name) user.name = name;
if (email) user.email = email;


if (password && password.trim() !== '') {
  user.password = password; 
}

await user.save();

res.json({
  message: '✅ Profile updated successfully',
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});
} catch (err) {
console.error('❌ Profile update error:', err.message);
res.status(500).json({ message: 'Server error', error: err.message });
}
};

