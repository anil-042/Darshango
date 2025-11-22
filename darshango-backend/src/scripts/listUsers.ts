import * as admin from 'firebase-admin';
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

const listUsers = async () => {
    try {
        console.log('Listing all users...');
        const snapshot = await db.collection('users').get();

        if (snapshot.empty) {
            console.log('No users found.');
            return;
        }

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`- Email: ${data.email}, Role: ${data.role}, Status: ${data.status}, Name: ${data.name}`);
        });

    } catch (error) {
        console.error('Error listing users:', error);
    } finally {
        process.exit(0);
    }
};

listUsers();
