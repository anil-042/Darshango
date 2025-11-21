import { db } from '../../config/firebase';

export const createProject = async (projectData: any) => {
    // BACKEND → FIRESTORE FLOW
    const docRef = await db.collection('projects').add({
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...projectData };
};

export const getAllProjects = async () => {
    // BACKEND → FIRESTORE FLOW
    const snapshot = await db.collection('projects').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProjectById = async (id: string) => {
    // BACKEND → FIRESTORE FLOW
    const doc = await db.collection('projects').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

export const updateProject = async (id: string, updateData: any) => {
    // BACKEND → FIRESTORE FLOW
    await db.collection('projects').doc(id).update({
        ...updateData,
        updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('projects').doc(id).get();
    return { id: doc.id, ...doc.data() };
};

export const deleteProject = async (id: string) => {
    // BACKEND → FIRESTORE FLOW
    await db.collection('projects').doc(id).delete();
    return true;
};
