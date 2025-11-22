import { db } from '../../config/firebase';

export const createProject = async (projectData: any) => {
    const docRef = await db.collection('projects').add({
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: 0,
        totalFundsReleased: 0,
        totalFundsUtilized: 0,
        pendingUCs: 0,
        milestoneCount: 0,
        inspectionCount: 0,
        documentCount: 0
    });
    return { id: docRef.id, ...projectData };
};

export const getAllProjects = async (filters: any = {}) => {
    let query: FirebaseFirestore.Query = db.collection('projects');

    if (filters.state) query = query.where('state', '==', filters.state);
    if (filters.district) query = query.where('district', '==', filters.district);
    if (filters.agencyId) query = query.where('implementingAgencyId', '==', filters.agencyId); // Or executingAgencyId
    if (filters.component) query = query.where('component', '==', filters.component);
    if (filters.status) query = query.where('status', '==', filters.status);

    const snapshot = await query.orderBy('updatedAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProjectById = async (id: string) => {
    const doc = await db.collection('projects').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

export const updateProject = async (id: string, updateData: any) => {
    await db.collection('projects').doc(id).update({
        ...updateData,
        updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('projects').doc(id).get();
    return { id: doc.id, ...doc.data() };
};

export const deleteProject = async (id: string) => {
    await db.collection('projects').doc(id).delete();
    return true;
};

export const recalculateProjectStats = async (projectId: string) => {
    const projectRef = db.collection('projects').doc(projectId);

    // Milestones
    const milestonesSnap = await projectRef.collection('milestones').get();
    const totalMilestones = milestonesSnap.size;
    const completedMilestones = milestonesSnap.docs.filter(d => d.data().status === 'Completed').length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    // Funds
    const fundsSnap = await projectRef.collection('funds').get();
    const released = fundsSnap.docs
        .filter(d => d.data().type === 'Release')
        .reduce((acc, d) => acc + (d.data().amount || 0), 0);
    const utilized = fundsSnap.docs
        .filter(d => d.data().type === 'Utilization')
        .reduce((acc, d) => acc + (d.data().amount || 0), 0);

    // Pending UCs (Funds released but not fully utilized/UC submitted - simplified logic)
    // A better logic: Count funds with type 'Release' that don't have a corresponding 'Utilization' or UC status 'Approved'
    // For now, let's count funds with ucStatus === 'Pending'
    const pendingUCs = fundsSnap.docs.filter(d => d.data().ucStatus === 'Pending').length;

    // Inspections
    const inspectionsSnap = await projectRef.collection('inspections').get();
    const inspectionCount = inspectionsSnap.size;

    // Documents
    const documentsSnap = await projectRef.collection('documents').get();
    const documentCount = documentsSnap.size;

    await projectRef.update({
        progress,
        totalFundsReleased: released,
        totalFundsUtilized: utilized,
        pendingUCs,
        milestoneCount: totalMilestones,
        inspectionCount,
        documentCount,
        updatedAt: new Date().toISOString()
    });
};
