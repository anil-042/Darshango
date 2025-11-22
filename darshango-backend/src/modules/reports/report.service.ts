import { db } from '../../config/firebase';

export const generateProjectReport = async (filters: any) => {
    let query: FirebaseFirestore.Query = db.collection('projects');

    if (filters.state) query = query.where('state', '==', filters.state);
    if (filters.district) query = query.where('district', '==', filters.district);
    if (filters.status) query = query.where('status', '==', filters.status);

    const snapshot = await query.get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            component: data.component,
            agency: data.implementingAgencyId, // Should ideally fetch agency name
            status: data.status,
            progress: data.progress,
            fundsReleased: data.totalFundsReleased,
            fundsUtilized: data.totalFundsUtilized
        };
    });
};

export const generateFundReport = async () => {
    const snapshot = await db.collectionGroup('funds').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const generateUCReport = async () => {
    // Fetch projects with pending UCs
    const snapshot = await db.collection('projects').where('pendingUCs', '>', 0).get();
    return snapshot.docs.map(doc => ({
        projectId: doc.id,
        projectTitle: doc.data().title,
        pendingUCs: doc.data().pendingUCs,
        lastUCSubmitted: doc.data().lastUCSubmitted
    }));
};
