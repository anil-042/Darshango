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

const activateUser = async () => {
    try {
        console.log('Activating users...');
        const snapshot = await db.collection('users').where('role', '==', 'Admin').get();

        if (snapshot.empty) {
            console.log('No Admin users found.');
            return;
        }

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            console.log(`Activating user: ${doc.data().email}`);
            batch.update(doc.ref, { status: 'Active' });
        });

        await batch.commit();
        console.log('All Admin users activated.');
    } catch (error) {
        console.error('Error activating users:', error);
    } finally {
        process.exit(0);
    }
};

activateUser();
