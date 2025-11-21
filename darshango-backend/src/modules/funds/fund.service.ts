import { db } from '../../config/firebase';

const recalculateProjectSpent = async (projectId: string) => {
    const snapshot = await db.collection('projects').doc(projectId).collection('funds').where('type', '==', 'Utilization').get();
    const totalSpent = snapshot.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);

    await db.collection('projects').doc(projectId).update({
        spent: totalSpent,
        updatedAt: new Date().toISOString()
    });
};

export const createFundTransaction = async (projectId: string, fundData: any) => {
    const docRef = await db.collection('projects').doc(projectId).collection('funds').add({
        ...fundData,
        projectId,
        createdAt: new Date().toISOString()
    });

    if (fundData.type === 'Utilization') {
        await recalculateProjectSpent(projectId);
    }

    return { id: docRef.id, ...fundData };
};

export const getFundTransactions = async (projectId: string) => {
    const snapshot = await db.collection('projects').doc(projectId).collection('funds').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateFundTransaction = async (projectId: string, fundId: string, updateData: any) => {
    await db.collection('projects').doc(projectId).collection('funds').doc(fundId).update(updateData);

    if (updateData.type === 'Utilization' || updateData.amount) {
        await recalculateProjectSpent(projectId);
    }

    const doc = await db.collection('projects').doc(projectId).collection('funds').doc(fundId).get();
    return { id: doc.id, ...doc.data() };
};

export const deleteFundTransaction = async (projectId: string, fundId: string) => {
    const doc = await db.collection('projects').doc(projectId).collection('funds').doc(fundId).get();
    const type = doc.data()?.type;

    await db.collection('projects').doc(projectId).collection('funds').doc(fundId).delete();

    if (type === 'Utilization') {
        await recalculateProjectSpent(projectId);
    }
    return true;
};
