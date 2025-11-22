import { db } from '../../config/firebase';
import { createAutoAlert } from '../alerts/alert.service';
import { recalculateProjectStats } from '../projects/project.service';

export const createInspection = async (projectId: string, inspectionData: any) => {
    const docRef = await db.collection('projects').doc(projectId).collection('inspections').add({
        ...inspectionData,
        projectId,
        createdAt: new Date().toISOString()
    });

    await recalculateProjectStats(projectId);

    if (inspectionData.rating === 'Needs Attention' || inspectionData.rating === 'Critical' || inspectionData.severity === 'Critical') {
        await createAutoAlert('Inspection', projectId, `Critical inspection finding: ${inspectionData.findings}`, 'High');
    }

    return { id: docRef.id, ...inspectionData };
};

export const getInspections = async (projectId: string) => {
    const snapshot = await db.collection('projects').doc(projectId).collection('inspections').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllInspections = async () => {
    const snapshot = await db.collectionGroup('inspections').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateInspection = async (projectId: string, inspectionId: string, updateData: any) => {
    await db.collection('projects').doc(projectId).collection('inspections').doc(inspectionId).update({
        ...updateData,
        updatedAt: new Date().toISOString()
    });

    await recalculateProjectStats(projectId);

    if (updateData.rating === 'Needs Attention' || updateData.rating === 'Critical') {
        await createAutoAlert('Inspection', projectId, `Critical inspection finding updated: ${updateData.findings}`, 'High');
    }

    const doc = await db.collection('projects').doc(projectId).collection('inspections').doc(inspectionId).get();
    return { id: doc.id, ...doc.data() };
};

export const deleteInspection = async (projectId: string, inspectionId: string) => {
    await db.collection('projects').doc(projectId).collection('inspections').doc(inspectionId).delete();
    await recalculateProjectStats(projectId);
    return true;
};
