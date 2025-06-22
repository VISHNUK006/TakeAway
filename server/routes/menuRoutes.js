
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const MenuItem = require('../models/menu');
const requireAuth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/requireAdmin');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
storage,
limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
fileFilter: (req, file, cb) => {
const allowedTypes = /jpeg|jpg|png|gif|svg/;
const ext = path.extname(file.originalname).toLowerCase();
const mime = file.mimetype;

if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
  cb(null, true);
} else {
  cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
}
}
});

module.exports = upload;

router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});

router.post('/', requireAuth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newItem = new MenuItem({
      name,
      price,
      description,
      category,
      image: imagePath
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Create failed', error: err.message });
  }
});

router.put('/:id', requireAuth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    const updatedData = { name, price, description, category };
    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await MenuItem.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

router.delete('/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
});

module.exports = router;





