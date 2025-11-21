import { db } from '../../config/firebase';

export const getAllUsers = async () => {
    // BACKEND → FIRESTORE FLOW
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUserById = async (id: string) => {
    // BACKEND → FIRESTORE FLOW
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

export const updateUser = async (id: string, updateData: any) => {
    // BACKEND → FIRESTORE FLOW
    await db.collection('users').doc(id).update(updateData);
    return getUserById(id);
};

export const deleteUser = async (id: string) => {
    // BACKEND → FIRESTORE FLOW
    await db.collection('users').doc(id).delete();
    return true;
};
