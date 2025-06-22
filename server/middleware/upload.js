const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, 'uploads/'); 
},
filename: (req, file, cb) => {
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
cb(null, uniqueSuffix + path.extname(file.originalname));
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
