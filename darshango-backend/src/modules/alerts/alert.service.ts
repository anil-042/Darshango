import { db } from '../../config/firebase';

export const createAlert = async (alertData: any) => {
    const docRef = await db.collection('alerts').add({
        ...alertData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...alertData };
};

export const getAllAlerts = async () => {
    const snapshot = await db.collection('alerts').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAlertsByProject = async (projectId: string) => {
    const snapshot = await db.collection('alerts').where('projectId', '==', projectId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateAlert = async (id: string, updateData: any) => {
    await db.collection('alerts').doc(id).update({
        ...updateData,
        updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('alerts').doc(id).get();
    return { id: doc.id, ...doc.data() };
};

export const deleteAlert = async (id: string) => {
    await db.collection('alerts').doc(id).delete();
    return true;
};
