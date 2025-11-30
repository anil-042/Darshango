import axiosInstance from './axiosInstance';

export interface DashboardStats {
    totalProjects: number;
    statusCounts: {
        completed: number;
        ongoing: number;
        delayed: number;
        underReview: number;
    };
    funds: {
        released: number;
        utilized: number;
        utilizationPercentage: number;
    };
    pendingUCs: number;
    activeAlerts: number;
    districtDistribution: Record<string, number>;
}

export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await axiosInstance.get('/dashboard/stats');
        return response.data.data;
    },
};
