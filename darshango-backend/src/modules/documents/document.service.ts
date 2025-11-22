import { db } from '../../config/firebase';
import { recalculateProjectStats } from '../projects/project.service';

export const uploadDocument = async (projectId: string, documentData: any) => {
    const docRef = await db.collection('projects').doc(projectId).collection('documents').add({
        ...documentData,
        projectId,
        uploadedAt: new Date().toISOString(),
        status: documentData.status || 'Pending'
    });

    await recalculateProjectStats(projectId);

    return { id: docRef.id, ...documentData };
};

export const getDocuments = async (projectId: string) => {
    const snapshot = await db.collection('projects').doc(projectId).collection('documents').orderBy('uploadedAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllDocuments = async () => {
    const snapshot = await db.collectionGroup('documents').orderBy('uploadedAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteDocument = async (projectId: string, documentId: string) => {
    await db.collection('projects').doc(projectId).collection('documents').doc(documentId).delete();
    await recalculateProjectStats(projectId);
    return true;
};
