import * as admin from 'firebase-admin';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin (Copy of config/firebase.ts logic simplified)
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        console.log('Firebase Initialized');
    } catch (error) {
        console.error('Firebase Init Failed:', error);
        process.exit(1);
    }
}

const db = admin.firestore();

const seedAdmin = async () => {
    const email = 'admin@darshango.com';
    const password = 'admin123'; // Default password
    const name = 'Admin User';

    try {
        // Check if admin exists
        const userQuery = await db.collection('users').where('email', '==', email).get();
        if (!userQuery.empty) {
            console.log('Admin user already exists.');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = {
            name,
            email,
            passwordHash,
            role: 'Admin',
            status: 'Active',
            createdAt: new Date().toISOString(),
        };

        await db.collection('users').add(newUser);
        console.log(`Admin user created successfully!`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

seedAdmin().then(() => process.exit(0));
