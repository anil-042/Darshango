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

const createSpecificUser = async () => {
    const email = 'user@pmajay.govt.in';
    const password = 'user123';
    const name = 'Government User';

    try {
        console.log(`Checking if user exists: ${email}`);
        const userQuery = await db.collection('users').where('email', '==', email).get();

        if (!userQuery.empty) {
            console.log('User already exists. Resetting password...');
            const userDoc = userQuery.docs[0];
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            await userDoc.ref.update({
                passwordHash,
                status: 'Active'
            });
            console.log('Password updated.');
        } else {
            console.log('User not found. Creating...');
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            await db.collection('users').add({
                name,
                email,
                passwordHash,
                role: 'StateNodalOfficer', // Giving a role that can view/edit projects
                status: 'Active',
                createdAt: new Date().toISOString(),
            });
            console.log('User created successfully.');
        }
        console.log(`Credentials: ${email} / ${password}`);

    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        process.exit(0);
    }
};

createSpecificUser();
