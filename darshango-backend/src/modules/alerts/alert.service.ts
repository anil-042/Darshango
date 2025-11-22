import { db } from '../../config/firebase';

export const createAlert = async (alertData: any) => {
    const docRef = await db.collection('alerts').add({
        ...alertData,
        createdAt: new Date().toISOString(),
        status: alertData.status || 'Open'
    });
    return { id: docRef.id, ...alertData };
};

export const getAlerts = async (filters: any = {}) => {
    let query: FirebaseFirestore.Query = db.collection('alerts');

    if (filters.projectId) {
        query = query.where('projectId', '==', filters.projectId);
    }
    if (filters.status) {
        query = query.where('status', '==', filters.status);
    }
    if (filters.priority) {
        query = query.where('priority', '==', filters.priority);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
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

export const createAutoAlert = async (type: string, projectId: string, description: string, priority: 'High' | 'Medium' | 'Low') => {
    // Check if similar open alert exists to avoid duplicates
    const existing = await db.collection('alerts')
        .where('projectId', '==', projectId)
        .where('type', '==', type)
        .where('status', 'in', ['Open', 'New', 'In Progress'])
        .get();

    if (!existing.empty) return;

    await createAlert({
        type,
        projectId,
        description,
        priority,
        status: 'New',
        date: new Date().toISOString()
    });
};
