import { db } from '../../config/firebase';

export const getAllUsers = async (filters: any = {}) => {
    // BACKEND → FIRESTORE FLOW
    let query: FirebaseFirestore.Query = db.collection('users');

    if (filters.role) query = query.where('role', '==', filters.role);
    if (filters.agencyId) query = query.where('agencyId', '==', filters.agencyId);
    if (filters.state) query = query.where('state', '==', filters.state);
    if (filters.district) query = query.where('district', '==', filters.district);

    const snapshot = await query.get();
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
