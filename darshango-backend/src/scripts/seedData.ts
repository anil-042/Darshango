import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
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

const clearCollection = async (collectionPath: string) => {
    const batch = db.batch();
    const snapshot = await db.collection(collectionPath).get();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Cleared collection: ${collectionPath}`);
};

const seedData = async () => {
    try {
        console.log('Starting seed...');

        // Clear existing data
        await clearCollection('projects');
        await clearCollection('agencies');

        // 1. Seed Agencies
        const agencies = [
            { name: 'TechBuild Solutions', contact: 'contact@techbuild.com', phone: '9876543210', activeProjects: 2, performance: 95 },
            { name: 'Urban Infra Ltd', contact: 'info@urbaninfra.com', phone: '9876543211', activeProjects: 1, performance: 88 },
            { name: 'Rural Dev Corp', contact: 'support@ruraldev.com', phone: '9876543212', activeProjects: 1, performance: 92 }
        ];

        const agencyIds: string[] = [];

        for (const agency of agencies) {
            const docRef = await db.collection('agencies').add({
                ...agency,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            });
            agencyIds.push(docRef.id);
            console.log(`Created Agency: ${agency.name}`);
        }

        // 2. Seed Projects
        const projects = [
            {
                title: 'Adarsh Gram Road Construction',
                description: 'Construction of 5km road in Adarsh Gram village.',
                state: 'State A',
                district: 'District A',
                status: 'In Progress',
                estimatedCost: 5000000,
                progress: 25,
                startDate: '2025-01-15',
                endDate: '2025-06-30',
                implementingAgencyId: agencyIds[0],
                executingAgencyId: agencyIds[0],
                component: 'Adarsh Gram'
            },
            {
                title: 'Community Hall Renovation',
                description: 'Renovation of the existing community hall.',
                state: 'State B',
                district: 'District B',
                status: 'In Progress', // Changed from Planning to match enum options if needed, or keep Planning if valid
                estimatedCost: 2500000,
                progress: 0,
                startDate: '2025-03-01',
                endDate: '2025-05-30',
                implementingAgencyId: agencyIds[1],
                executingAgencyId: agencyIds[1],
                component: 'GIA'
            },
            {
                title: 'New Hostel Building',
                description: 'Construction of a new 50-bed hostel for students.',
                state: 'State A',
                district: 'District A',
                status: 'Completed',
                estimatedCost: 10000000,
                progress: 100,
                startDate: '2024-06-01',
                endDate: '2024-12-31',
                implementingAgencyId: agencyIds[0],
                executingAgencyId: agencyIds[0],
                component: 'Hostel'
            },
            {
                title: 'Solar Power Installation',
                description: 'Installation of solar panels in 10 villages.',
                state: 'State C',
                district: 'District C',
                status: 'In Progress',
                estimatedCost: 7500000,
                progress: 40,
                startDate: '2025-02-01',
                endDate: '2025-08-30',
                implementingAgencyId: agencyIds[2],
                executingAgencyId: agencyIds[2],
                component: 'Adarsh Gram'
            }
        ];

        for (const project of projects) {
            await db.collection('projects').add({
                ...project,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log(`Created Project: ${project.title}`);
        }

        console.log('Seeding completed successfully!');

    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

seedData().then(() => process.exit(0));
