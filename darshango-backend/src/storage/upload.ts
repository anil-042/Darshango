import { storage } from '../config/firebase';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

export const uploadFileToStorage = async (file: Express.Multer.File, folder: string) => {
    const bucket = storage.bucket();
    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    return new Promise<string>((resolve, reject) => {
        stream.on('error', (error) => {
            reject(error);
        });

        stream.on('finish', async () => {
            // Make the file public
            await fileUpload.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            resolve(publicUrl);
        });

        stream.end(file.buffer);
    });
};

export default upload;
