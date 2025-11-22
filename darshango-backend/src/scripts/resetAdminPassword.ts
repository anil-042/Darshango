import * as admin from 'firebase-admin';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

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
    } catch (error) {
        console.error('Firebase Init Failed:', error);
        process.exit(1);
    }
}

const db = admin.firestore();

const resetAdminPassword = async () => {
    const email = 'admin@darshango.com';
    const password = 'admin123';

    try {
        console.log(`Searching for user: ${email}`);
        const userQuery = await db.collection('users').where('email', '==', email).get();

        if (userQuery.empty) {
            console.log('User not found. Creating new admin...');
            // Fallback to creating if not found
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            await db.collection('users').add({
                name: 'Admin User',
                email,
                passwordHash,
                role: 'Admin',
                status: 'Active',
                createdAt: new Date().toISOString(),
            });
            console.log('Admin user created.');
        } else {
            console.log('User found. Updating password...');
            const userDoc = userQuery.docs[0];
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            await userDoc.ref.update({
                passwordHash,
                status: 'Active' // Ensure active status
            });
            console.log('Password updated successfully.');
        }
        console.log(`Credentials: ${email} / ${password}`);

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        process.exit(0);
    }
};

resetAdminPassword();
