import { db } from '../../config/firebase';

export const getDashboardStats = async (filters: any = {}) => {
    // This is a heavy operation, in production we might want to cache this or use counters
    const projectsSnapshot = await db.collection('projects').get();
    const projects = projectsSnapshot.docs.map(doc => doc.data());

    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const ongoingProjects = projects.filter(p => p.status === 'In Progress').length;
    const delayedProjects = projects.filter(p => p.status === 'Delayed').length;

    const totalFundsReleased = projects.reduce((acc, p) => acc + (p.totalFundsReleased || 0), 0);
    const totalFundsUtilized = projects.reduce((acc, p) => acc + (p.totalFundsUtilized || 0), 0);

    const pendingUCs = projects.reduce((acc, p) => acc + (p.pendingUCs || 0), 0);

    const alertsSnapshot = await db.collection('alerts').where('status', 'in', ['Open', 'New', 'In Progress']).get();
    const activeAlerts = alertsSnapshot.size;

    // Geo distribution (simple count by district)
    const districtDistribution: Record<string, number> = {};
    projects.forEach(p => {
        const district = p.district || 'Unknown';
        districtDistribution[district] = (districtDistribution[district] || 0) + 1;
    });

    return {
        totalProjects,
        statusCounts: {
            completed: completedProjects,
            ongoing: ongoingProjects,
            delayed: delayedProjects,
            underReview: totalProjects - completedProjects - ongoingProjects - delayedProjects
        },
        funds: {
            released: totalFundsReleased,
            utilized: totalFundsUtilized,
            utilizationPercentage: totalFundsReleased > 0 ? (totalFundsUtilized / totalFundsReleased) * 100 : 0
        },
        pendingUCs,
        activeAlerts,
        districtDistribution
    };
};
