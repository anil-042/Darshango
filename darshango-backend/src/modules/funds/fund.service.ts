import { db } from '../../config/firebase';

import { recalculateProjectStats } from '../projects/project.service';
import { createAutoAlert } from '../alerts/alert.service';

export const createFundTransaction = async (projectId: string, fundData: any) => {
    const docRef = await db.collection('projects').doc(projectId).collection('funds').add({
        ...fundData,
        projectId,
        createdAt: new Date().toISOString(),
        ucStatus: fundData.ucStatus || 'Pending'
    });

    await recalculateProjectStats(projectId);

    return { id: docRef.id, ...fundData };
};

export const getFundTransactions = async (projectId: string) => {
    const snapshot = await db.collection('projects').doc(projectId).collection('funds').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllFundTransactions = async () => {
    const snapshot = await db.collectionGroup('funds').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateFundTransaction = async (projectId: string, fundId: string, updateData: any) => {
    await db.collection('projects').doc(projectId).collection('funds').doc(fundId).update({
        ...updateData,
        updatedAt: new Date().toISOString()
    });

    await recalculateProjectStats(projectId);

    // Check for UC status change
    if (updateData.ucStatus === 'Pending' && updateData.type === 'Release') {
        // Logic to check if UC is overdue could go here or in a scheduled job
    }

    const doc = await db.collection('projects').doc(projectId).collection('funds').doc(fundId).get();
    return { id: doc.id, ...doc.data() };
};

export const deleteFundTransaction = async (projectId: string, fundId: string) => {
    await db.collection('projects').doc(projectId).collection('funds').doc(fundId).delete();
    await recalculateProjectStats(projectId);
    return true;
};
