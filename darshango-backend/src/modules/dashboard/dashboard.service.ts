import { supabase } from '../../config/supabase';

export const getDashboardStats = async (filters: any = {}) => {
    // Fetch all projects with necessary fields
    const { data: projects, error } = await supabase
        .from('projects')
        .select('status, total_funds_released, total_funds_utilized, pending_ucs, district');

    if (error) throw new Error(error.message);

    const totalProjects = projects.length;
    const completedProjects = projects.filter((p: any) => p.status === 'Completed').length;
    const ongoingProjects = projects.filter((p: any) => p.status === 'In Progress').length;
    const delayedProjects = projects.filter((p: any) => p.status === 'Delayed').length;

    // Global Fund Stats
    const { data: fundsData, error: fundsError } = await supabase
        .from('funds')
        .select('amount, type');

    if (fundsError) throw new Error(fundsError.message);

    const totalFundsReleased = fundsData
        .filter((f: any) => f.type === 'Agency Release' || f.type === 'District Allocation')
        .reduce((acc: number, f: any) => acc + (f.amount || 0), 0);

    const totalFundsUtilized = fundsData
        .filter((f: any) => f.type === 'Utilization')
        .reduce((acc: number, f: any) => acc + (f.amount || 0), 0);

    const pendingUCs = projects.reduce((acc: number, p: any) => acc + (p.pending_ucs || 0), 0);

    // Active Alerts
    const { count: activeAlerts, error: alertError } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .in('status', ['Open', 'New', 'In Progress']);

    if (alertError) throw new Error(alertError.message);

    // Geo distribution
    const districtDistribution: Record<string, number> = {};
    projects.forEach((p: any) => {
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
        activeAlerts: activeAlerts || 0,
        districtDistribution
    };
};
