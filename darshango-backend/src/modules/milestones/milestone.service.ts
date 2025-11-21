import { db } from '../../config/firebase';

const recalculateProjectProgress = async (projectId: string) => {
    const snapshot = await db.collection('projects').doc(projectId).collection('milestones').get();
    const totalMilestones = snapshot.size;

    if (totalMilestones === 0) return;

    const completedMilestones = snapshot.docs.filter(doc => doc.data().status === 'Completed').length;
    const progress = Math.round((completedMilestones / totalMilestones) * 100);

    await db.collection('projects').doc(projectId).update({
        progress,
        updatedAt: new Date().toISOString()
    });
};

export const createMilestone = async (projectId: string, milestoneData: any) => {
    const docRef = await db.collection('projects').doc(projectId).collection('milestones').add({
        ...milestoneData,
        projectId,
        createdAt: new Date().toISOString()
    });

    await recalculateProjectProgress(projectId);

    return { id: docRef.id, ...milestoneData };
};

export const getMilestones = async (projectId: string) => {
    const snapshot = await db.collection('projects').doc(projectId).collection('milestones').orderBy('dueDate').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateMilestone = async (projectId: string, milestoneId: string, updateData: any) => {
    await db.collection('projects').doc(projectId).collection('milestones').doc(milestoneId).update(updateData);

    if (updateData.status) {
        await recalculateProjectProgress(projectId);
    }

    const doc = await db.collection('projects').doc(projectId).collection('milestones').doc(milestoneId).get();
    return { id: doc.id, ...doc.data() };
};

export const deleteMilestone = async (projectId: string, milestoneId: string) => {
    await db.collection('projects').doc(projectId).collection('milestones').doc(milestoneId).delete();
    await recalculateProjectProgress(projectId);
    return true;
};
