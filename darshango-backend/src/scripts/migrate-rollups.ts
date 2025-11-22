import { db } from '../config/firebase';

const migrateRollups = async () => {
    console.log('Starting rollup migration...');
    const projectsSnapshot = await db.collection('projects').get();

    for (const doc of projectsSnapshot.docs) {
        const projectId = doc.id;
        console.log(`Processing project: ${projectId}`);

        // 1. Milestones Progress
        const milestonesSnap = await db.collection('projects').doc(projectId).collection('milestones').get();
        const totalMilestones = milestonesSnap.size;
        const completedMilestones = milestonesSnap.docs.filter(m => m.data().status === 'Completed').length;
        const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

        // 2. Funds Utilized
        const fundsSnap = await db.collection('projects').doc(projectId).collection('funds').where('type', '==', 'Utilization').get();
        const spent = fundsSnap.docs.reduce((acc, f) => acc + (f.data().amount || 0), 0);

        // 3. Inspection Stats
        const inspectionsSnap = await db.collection('projects').doc(projectId).collection('inspections').get();
        const totalInspections = inspectionsSnap.size;
        const completedInspections = inspectionsSnap.docs.filter(i => i.data().status === 'Completed').length;

        // Update Project
        await db.collection('projects').doc(projectId).update({
            progress,
            spent,
            totalInspections,
            completedInspections,
            updatedAt: new Date().toISOString()
        });
        console.log(`Updated project ${projectId}: Progress=${progress}%, Spent=${spent}`);
    }

    console.log('Migration completed successfully.');
};

migrateRollups().catch(console.error);
