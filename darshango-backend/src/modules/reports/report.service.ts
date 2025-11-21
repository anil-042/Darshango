import { db } from '../../config/firebase';

export const getDashboardStats = async () => {
    const projectsSnap = await db.collection('projects').get();
    const fundsSnap = await db.collection('funds').get();
    const alertsSnap = await db.collection('alerts').where('status', '==', 'Open').get();

    const totalProjects = projectsSnap.size;
    const totalFunds = fundsSnap.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);
    const activeAlerts = alertsSnap.size;

    return {
        totalProjects,
        totalFunds,
        activeAlerts
    };
};

export const getStatePerformance = async () => {
    // Mock aggregation for now as Firestore doesn't support complex group by queries easily without external tools
    // In a real app, we'd use aggregation queries or maintain counters
    return [
        { state: 'UP', projects: 145, completion: 68, funds: 850 },
        { state: 'MH', projects: 128, completion: 72, funds: 720 },
        { state: 'RJ', projects: 98, completion: 65, funds: 650 },
        { state: 'GJ', projects: 87, completion: 78, funds: 580 },
        { state: 'MP', projects: 76, completion: 61, funds: 520 },
    ];
};

export const getComponentUtilization = async () => {
    const projectsSnap = await db.collection('projects').get();
    const utilization: any = { 'Adarsh Gram': 0, 'GIA': 0, 'Hostel': 0 };

    projectsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (utilization[data.component] !== undefined) {
            utilization[data.component] += (data.estimatedCost || 0);
        }
    });

    return Object.keys(utilization).map(key => ({
        name: key,
        value: utilization[key],
        allocated: utilization[key] * 1.2 // Mock allocation
    }));
};
