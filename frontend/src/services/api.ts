import axiosInstance from './axiosInstance';
import {
    Project,
    Agency,
    Transaction,
    Inspection,
    Document,
    Alert,
    User,
    Milestone
} from '../types';

// API Service
export const api = {
    // PROJECTS
    projects: {
        getAll: async (): Promise<Project[]> => {
            const response = await axiosInstance.get('/projects');
            return response.data.data;
        },
        getById: async (id: string): Promise<Project | undefined> => {
            const response = await axiosInstance.get(`/projects/${id}`);
            return response.data.data;
        },
        create: async (project: Omit<Project, 'id'>): Promise<Project> => {
            const response = await axiosInstance.post('/projects', project);
            return response.data.data;
        },
        update: async (id: string, updates: Partial<Project>): Promise<Project> => {
            const response = await axiosInstance.put(`/projects/${id}`, updates);
            return response.data.data;
        },
        delete: async (id: string): Promise<void> => {
            await axiosInstance.delete(`/projects/${id}`);
        }
    },

    // AGENCIES
    agencies: {
        getAll: async (): Promise<Agency[]> => {
            const response = await axiosInstance.get('/agencies');
            return response.data.data || [];
        },
        create: async (agency: Omit<Agency, 'id'>): Promise<Agency> => {
            const response = await axiosInstance.post('/agencies', agency);
            return response.data.data;
        },
        update: async (id: string, updates: Partial<Agency>): Promise<Agency> => {
            const response = await axiosInstance.put(`/agencies/${id}`, updates);
            return response.data.data;
        },
        delete: async (id: string): Promise<void> => {
            await axiosInstance.delete(`/agencies/${id}`);
        }
    },

    // TRANSACTIONS (FUNDS)
    transactions: {
        getAll: async (): Promise<Transaction[]> => {
            const response = await axiosInstance.get('/funds'); // Global funds endpoint
            return response.data.data;
        },
        getByProject: async (projectId: string): Promise<Transaction[]> => {
            const response = await axiosInstance.get(`/projects/${projectId}/funds`);
            return response.data.data;
        },
        create: async (txn: Omit<Transaction, 'id'>): Promise<Transaction> => {
            let url = '/funds';
            const payload: any = { ...txn };

            if (txn.projectId && txn.projectId !== 'GLOBAL_FUND_FLOW') {
                url = `/projects/${txn.projectId}/funds`;
            } else {
                // Ensure projectId is removed for global funds so backend treats it as global
                delete payload.projectId;
            }

            const response = await axiosInstance.post(url, payload);
            return response.data.data;
        },
        update: async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
            const response = await axiosInstance.patch(`/funds/${id}`, updates);
            return response.data.data;
        },
        delete: async (id: string, projectId?: string): Promise<void> => {
            let url = `/funds/${id}`;
            if (projectId && projectId !== 'GLOBAL_FUND_FLOW') {
                url += `?projectId=${projectId}`;
            }
            const response = await axiosInstance.delete(url);
            return response.data.data;
        }
    },

    // INSPECTIONS
    inspections: {
        getAll: async (): Promise<Inspection[]> => {
            const response = await axiosInstance.get('/inspections');
            return response.data.data;
        },
        getById: async (id: string): Promise<Inspection> => {
            const response = await axiosInstance.get(`/inspections/${id}`);
            return response.data.data;
        },
        getByProject: async (projectId: string): Promise<Inspection[]> => {
            const response = await axiosInstance.get(`/projects/${projectId}/inspections`);
            return response.data.data;
        },
        create: async (inspection: Omit<Inspection, 'id'>): Promise<Inspection> => {
            const response = await axiosInstance.post(`/projects/${inspection.projectId}/inspections`, inspection);
            return response.data.data;
        },
        update: async (id: string, updates: Partial<Inspection>): Promise<Inspection> => {
            // We need projectId to construct the URL: /projects/:pid/inspections/:iid
            // If updates doesn't have projectId, we are in trouble unless we have global update.
            // For now, assuming we have it or use global if implemented.
            // Let's implement global update in backend to be safe.
            const response = await axiosInstance.put(`/inspections/${id}`, updates);
            return response.data.data;
        },
        delete: async (id: string, projectId?: string): Promise<void> => {
            let url = `/inspections/${id}`;
            if (projectId) {
                url = `/projects/${projectId}/inspections/${id}`;
            }
            const response = await axiosInstance.delete(url);
            return response.data.data;
        }
    },

    // DOCUMENTS
    documents: {
        getAll: async (): Promise<Document[]> => {
            // Global documents endpoint
            const response = await axiosInstance.get('/documents');
            return response.data.data;
        },
        create: async (document: any): Promise<Document> => {
            const projectId = document.get('projectId');
            let url = '/documents';
            if (projectId && projectId !== 'undefined' && projectId !== 'null') {
                url = `/projects/${projectId}/documents`;
            }

            const response = await axiosInstance.post(url, document, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        },
        delete: async (id: string): Promise<void> => {
            const response = await axiosInstance.delete(`/documents/${id}`);
            return response.data.data;
        }
    },

    // ALERTS
    alerts: {
        getAll: async (): Promise<Alert[]> => {
            const response = await axiosInstance.get('/alerts');
            return response.data.data;
        },
        create: async (alert: Omit<Alert, 'id'>): Promise<Alert> => {
            const response = await axiosInstance.post('/alerts', alert);
            return response.data.data;
        },
        update: async (id: string, updates: Partial<Alert>): Promise<Alert> => {
            const response = await axiosInstance.patch(`/alerts/${id}`, updates);
            return response.data.data;
        },
        delete: async (id: string): Promise<void> => {
            await axiosInstance.delete(`/alerts/${id}`);
        }
    },

    // USERS (ADMIN)
    users: {
        getAll: async (): Promise<User[]> => {
            const response = await axiosInstance.get('/users');
            return response.data.data;
        },
        create: async (user: Omit<User, 'id'>): Promise<User> => {
            const response = await axiosInstance.post('/users', user);
            return response.data.data;
        },
        update: async (id: string, updates: Partial<User>): Promise<User> => {
            const response = await axiosInstance.patch(`/users/${id}`, updates);
            return response.data.data;
        },
        delete: async (id: string): Promise<void> => {
            await axiosInstance.delete(`/users/${id}`);
        }
    },

    // MILESTONES
    milestones: {
        getAll: async (): Promise<Milestone[]> => {
            // Global milestones? Or per project?
            // Frontend might want all for a summary.
            const response = await axiosInstance.get('/milestones'); // Need to implement global
            return response.data.data;
        },
        create: async (milestone: Omit<Milestone, 'id'>): Promise<Milestone> => {
            const response = await axiosInstance.post(`/projects/${milestone.projectId}/milestones`, milestone);
            return response.data.data;
        },
        update: async (projectId: string, milestoneId: string, updates: Partial<Milestone>): Promise<Milestone> => {
            const response = await axiosInstance.put(`/projects/${projectId}/milestones/${milestoneId}`, updates);
            return response.data.data;
        },
        delete: async (projectId: string, milestoneId: string): Promise<void> => {
            const response = await axiosInstance.delete(`/projects/${projectId}/milestones/${milestoneId}`);
            return response.data.data;
        }
    },

    // MEETINGS
    meetings: {
        getAll: async (): Promise<any[]> => {
            const response = await axiosInstance.get('/meetings');
            return response.data.data;
        },
        create: async (meeting: { meetingWith: string, meetingId: string }): Promise<any> => {
            const response = await axiosInstance.post('/meetings', meeting);
            return response.data.data;
        }
    },

    // MESSAGES
    messages: {
        getByProject: async (projectId: string): Promise<any[]> => {
            const response = await axiosInstance.get(`/projects/${projectId}/messages`);
            return response.data.data;
        },
        create: async (projectId: string, content: string, file?: File): Promise<any> => {
            const formData = new FormData();
            formData.append('content', content);
            if (file) {
                formData.append('file', file);
            }

            const response = await axiosInstance.post(`/projects/${projectId}/messages`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data;
        }
    },

    // PERMISSIONS
    permissions: {
        get: async (): Promise<any> => {
            const response = await axiosInstance.get('/permissions');
            return response.data.data;
        },
        update: async (permissions: any): Promise<any> => {
            const response = await axiosInstance.post('/permissions', permissions);
            return response.data.data;
        }
    }
};
