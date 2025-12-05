import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadFileToStorage = async (file: Express.Multer.File): Promise<string> => {
    // Since we are using diskStorage, the file is already saved.
    // We just need to return the public URL.
    // Assuming the backend serves 'uploads' directory at /uploads
    const baseUrl = process.env.API_URL || 'http://localhost:5001';
    return `${baseUrl}/uploads/${file.filename}`;
};

export default upload;
