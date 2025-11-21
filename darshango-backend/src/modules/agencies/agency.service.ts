import { db } from '../../config/firebase';

export const createAgency = async (agencyData: any) => {
    const docRef = await db.collection('agencies').add({
        ...agencyData,
        createdAt: new Date().toISOString(),
        activeProjects: 0,
        performance: 0,
        lastUpdated: new Date().toISOString()
    });
    return { id: docRef.id, ...agencyData };
};

export const getAllAgencies = async () => {
    // BACKEND → FIRESTORE FLOW
    const snapshot = await db.collection('agencies').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateAgency = async (id: string, updateData: any) => {
    // BACKEND → FIRESTORE FLOW
    await db.collection('agencies').doc(id).update({
        ...updateData,
        lastUpdated: new Date().toISOString()
    });
    const doc = await db.collection('agencies').doc(id).get();
    return { id: doc.id, ...doc.data() };
};

export const deleteAgency = async (id: string) => {
    // BACKEND → FIRESTORE FLOW
    await db.collection('agencies').doc(id).delete();
    return true;
};
