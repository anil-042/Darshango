import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
// In production, use a service account JSON file or environment variables
// For this setup, we'll use environment variables

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;
let storage: admin.storage.Storage;

try {
    if (!admin.apps.length) {
        // Check if critical env vars are present to avoid "Failed to parse private key" immediately if empty
        if (!process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY === "your-private-key") {
            throw new Error('Missing or default FIREBASE_PRIVATE_KEY in .env');
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle private key newlines for different environments
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        console.log('Firebase Admin Initialized');
    }

    db = admin.firestore();
    auth = admin.auth();
    storage = admin.storage();

} catch (error) {
    console.error('Firebase Admin Initialization Failed:', error);
    console.warn('⚠️  Server starting without Firebase connection. Database operations will fail until valid credentials are provided in .env.');

    // Mock objects to prevent crash on import, but throw on usage
    const mockThrow = () => { throw new Error('Firebase not initialized. Please check your .env file and provide valid Firebase credentials.'); };

    // Cast to any to bypass strict typing for the mock
    db = {
        collection: () => ({
            doc: () => ({ get: mockThrow, set: mockThrow, update: mockThrow, delete: mockThrow }),
            add: mockThrow,
            where: () => ({ get: mockThrow }),
            get: mockThrow
        })
    } as any;

    auth = {
        getUser: mockThrow,
        getUserByEmail: mockThrow,
        createUser: mockThrow,
        updateUser: mockThrow,
        deleteUser: mockThrow,
        verifyIdToken: mockThrow
    } as any;

    storage = {
        bucket: () => ({ file: () => ({ save: mockThrow, delete: mockThrow, getSignedUrl: mockThrow }) })
    } as any;
}

export { db, auth, storage };
