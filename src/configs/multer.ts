import multer from 'multer';

// Set up multer for file storage in memory
const upload = multer({ storage: multer.memoryStorage() });

export { upload };
