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

const checkProjects = async () => {
    try {
        const snapshot = await db.collection('projects').get();
        console.log(`Found ${snapshot.size} projects.`);
        snapshot.docs.forEach(doc => {
            console.log(`- ${doc.data().title} (${doc.data().component})`);
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};

checkProjects().then(() => process.exit(0));
