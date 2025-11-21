import { db } from '../../config/firebase';

export const createInspection = async (projectId: string, inspectionData: any) => {
    // BACKEND → FIRESTORE FLOW
    const docRef = await db.collection('projects').doc(projectId).collection('inspections').add({
        ...inspectionData,
        projectId,
        createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...inspectionData };
};

export const getInspections = async (projectId: string) => {
    // BACKEND → FIRESTORE FLOW
    const snapshot = await db.collection('projects').doc(projectId).collection('inspections').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateInspection = async (projectId: string, inspectionId: string, updateData: any) => {
    // BACKEND → FIRESTORE FLOW
    await db.collection('projects').doc(projectId).collection('inspections').doc(inspectionId).update(updateData);
    const doc = await db.collection('projects').doc(projectId).collection('inspections').doc(inspectionId).get();
    return { id: doc.id, ...doc.data() };
};
