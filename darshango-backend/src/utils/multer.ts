import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'darshango-uploads', // Optional: organize uploads in a folder
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf', 'docx', 'xlsx'],
        resource_type: 'auto', // Auto-detect resource type (image, raw, video)
    } as any, // Type assertion needed due to loose types in multer-storage-cloudinary
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed: jpg, png, webp, pdf, docx, xlsx'));
        }
    },
});

export default upload;
