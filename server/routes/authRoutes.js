
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const { register, login, getProfile } = require('../controllers/authController');
const { updateProfile } = require('../controllers/authController');
const upload = require('../middleware/upload');
const User = require('../models/User');


router.post('/register', register);
router.post('/login', login);
router.get('/profile', requireAuth, getProfile);
router.patch('/profile', requireAuth, updateProfile);

router.post('/upload', requireAuth, upload.single('image'), async (req, res) => {
try {
if (!req.file) {
return res.status(400).json({ message: 'No file uploaded' });
}

const user = await User.findByIdAndUpdate(
  req.user._id,
  { profilePicture: `/uploads/${req.file.filename}` },
  { new: true }
);

if (!user) return res.status(404).json({ message: 'User not found' });

res.json({ message: '✅ Image uploaded successfully', user });
} catch (err) {
console.error('❌ Upload error:', err.message);
res.status(500).json({ message: 'Upload failed', error: err.message });
}
});

module.exports = router;