import { db } from '../../config/firebase';
import { recalculateProjectStats } from '../projects/project.service';

export const createMilestone = async (projectId: string, milestoneData: any) => {
    const docRef = await db.collection('projects').doc(projectId).collection('milestones').add({
        ...milestoneData,
        projectId,
        createdAt: new Date().toISOString(),
        orderIndex: milestoneData.orderIndex || 0
    });

    await recalculateProjectStats(projectId);

    return { id: docRef.id, ...milestoneData };
};

export const getMilestones = async (projectId: string) => {
    const snapshot = await db.collection('projects').doc(projectId).collection('milestones').orderBy('orderIndex', 'asc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllMilestones = async () => {
    const snapshot = await db.collectionGroup('milestones').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateMilestone = async (projectId: string, milestoneId: string, updateData: any) => {
    await db.collection('projects').doc(projectId).collection('milestones').doc(milestoneId).update({
        ...updateData,
        updatedAt: new Date().toISOString()
    });

    await recalculateProjectStats(projectId);

    const doc = await db.collection('projects').doc(projectId).collection('milestones').doc(milestoneId).get();
    return { id: doc.id, ...doc.data() };
};

export const deleteMilestone = async (projectId: string, milestoneId: string) => {
    await db.collection('projects').doc(projectId).collection('milestones').doc(milestoneId).delete();
    await recalculateProjectStats(projectId);
    return true;
};
