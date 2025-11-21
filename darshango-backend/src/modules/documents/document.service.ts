import { db } from '../../config/firebase';

export const createDocument = async (projectId: string, documentData: any) => {
    // BACKEND → FIRESTORE FLOW
    const docRef = await db.collection('projects').doc(projectId).collection('documents').add({
        ...documentData,
        projectId,
        uploadedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...documentData };
};

export const getDocuments = async (projectId: string) => {
    // BACKEND → FIRESTORE FLOW
    const snapshot = await db.collection('projects').doc(projectId).collection('documents').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteDocument = async (projectId: string, docId: string) => {
    // BACKEND → FIRESTORE FLOW
    await db.collection('projects').doc(projectId).collection('documents').doc(docId).delete();
    return true;
};
