const multer = require('multer');
const path = require('path');

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to backend/uploads directory
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename to avoid overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Validate file types (mime types & extensions)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isExtensionValid = allowedExtensions.includes(ext);
  const isMimeTypeValid = allowedMimeTypes.includes(mime);

  if (isExtensionValid && isMimeTypeValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF, DOC, and DOCX resumes are allowed!'), false);
  }
};

// Multer upload instances
const uploadResumeFile = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB maximum limit
  },
  fileFilter
});

module.exports = {
  uploadResumeFile
};
