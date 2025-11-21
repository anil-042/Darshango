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
import {
    initialProjects,
    initialAgencies,
    initialTransactions,
    initialInspections,
    initialDocuments,
    initialAlerts,
    initialUsers,
    initialMilestones
} from './mockData';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to load/save from localStorage
const loadData = <T>(key: string, initial: T): T => {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
};

const saveData = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// API Service
export const api = {
    // PROJECTS
    projects: {
        /**
         * GET /api/projects
         * Fetch all projects with optional filtering
         * @returns {Promise<Project[]>} List of projects
         */
        getAll: async (): Promise<Project[]> => {
            await delay(500);
            return loadData('projects_v2', initialProjects);
        },

        /**
         * GET /api/projects/{id}
         * Fetch a single project by ID
         * @param {string} id - Project ID
         * @returns {Promise<Project | undefined>} Project details
         */
        getById: async (id: string): Promise<Project | undefined> => {
            await delay(300);
            const projects = loadData('projects_v2', initialProjects);
            return projects.find(p => p.id === id);
        },

        /**
         * POST /api/projects
         * Create a new project
         * @param {Omit<Project, 'id'>} project - Project data
         * @returns {Promise<Project>} Created project
         */
        create: async (project: Omit<Project, 'id'>): Promise<Project> => {
            await delay(800);
            const projects = loadData('projects_v2', initialProjects);
            const newProject = { ...project, id: `PRJ-${Date.now()}` };
            saveData('projects_v2', [...projects, newProject]);
            return newProject;
        },

        /**
         * PATCH /api/projects/{id}
         * Update an existing project
         * @param {string} id - Project ID
         * @param {Partial<Project>} updates - Fields to update
         * @returns {Promise<Project>} Updated project
         */
        update: async (id: string, updates: Partial<Project>): Promise<Project> => {
            await delay(600);
            const projects = loadData('projects_v2', initialProjects);
            const index = projects.findIndex(p => p.id === id);
            if (index === -1) throw new Error('Project not found');

            const updatedProject = { ...projects[index], ...updates };
            projects[index] = updatedProject;
            saveData('projects_v2', projects);
            return updatedProject;
        },

        /**
         * DELETE /api/projects/{id}
         * Delete a project
         * @param {string} id - Project ID
         * @returns {Promise<void>}
         */
        delete: async (id: string): Promise<void> => {
            await delay(500);
            const projects = loadData('projects_v2', initialProjects);
            const filtered = projects.filter(p => p.id !== id);
            saveData('projects_v2', filtered);
        }
    },

    // AGENCIES
    agencies: {
        /**
         * GET /api/agencies
         * Fetch all agencies
         * @returns {Promise<Agency[]>} List of agencies
         */
        getAll: async (): Promise<Agency[]> => {
            await delay(500);
            return loadData('agencies_v2', initialAgencies);
        },

        /**
         * POST /api/agencies
         * Create a new agency
         * @param {Omit<Agency, 'id'>} agency - Agency data
         * @returns {Promise<Agency>} Created agency
         */
        create: async (agency: Omit<Agency, 'id'>): Promise<Agency> => {
            await delay(800);
            const agencies = loadData('agencies_v2', initialAgencies);
            const newAgency = { ...agency, id: `AGY-${Date.now()}` };
            saveData('agencies_v2', [...agencies, newAgency]);
            return newAgency;
        },

        /**
         * PATCH /api/agencies/{id}
         * Update an agency
         * @param {string} id - Agency ID
         * @param {Partial<Agency>} updates - Fields to update
         * @returns {Promise<Agency>} Updated agency
         */
        update: async (id: string, updates: Partial<Agency>): Promise<Agency> => {
            await delay(600);
            const agencies = loadData('agencies_v2', initialAgencies);
            const index = agencies.findIndex(a => a.id === id);
            if (index === -1) throw new Error('Agency not found');

            const updatedAgency = { ...agencies[index], ...updates };
            agencies[index] = updatedAgency;
            saveData('agencies_v2', agencies);
            return updatedAgency;
        },

        /**
         * DELETE /api/agencies/{id}
         * Delete an agency
         * @param {string} id - Agency ID
         * @returns {Promise<void>}
         */
        delete: async (id: string): Promise<void> => {
            await delay(500);
            const agencies = loadData('agencies_v2', initialAgencies);
            const filtered = agencies.filter(a => a.id !== id);
            saveData('agencies_v2', filtered);
        }
    },

    // TRANSACTIONS (FUNDS)
    transactions: {
        /**
         * GET /api/transactions
         * Fetch all fund transactions
         * @returns {Promise<Transaction[]>} List of transactions
         */
        getAll: async (): Promise<Transaction[]> => {
            await delay(400);
            return loadData('transactions_v2', initialTransactions);
        },

        /**
         * POST /api/transactions
         * Create a new transaction
         * @param {Omit<Transaction, 'id'>} txn - Transaction data
         * @returns {Promise<Transaction>} Created transaction
         */
        create: async (txn: Omit<Transaction, 'id'>): Promise<Transaction> => {
            await delay(700);
            const txns = loadData('transactions_v2', initialTransactions);
            const newTxn = { ...txn, id: `TXN-${Date.now()}` };
            saveData('transactions_v2', [...txns, newTxn]);
            return newTxn;
        },

        /**
         * PATCH /api/transactions/{id}
         * Update a transaction
         * @param {string} id - Transaction ID
         * @param {Partial<Transaction>} updates - Fields to update
         * @returns {Promise<Transaction>} Updated transaction
         */
        update: async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
            await delay(600);
            const txns = loadData('transactions_v2', initialTransactions);
            const index = txns.findIndex(t => t.id === id);
            if (index === -1) throw new Error('Transaction not found');

            const updatedTxn = { ...txns[index], ...updates };
            txns[index] = updatedTxn;
            saveData('transactions_v2', txns);
            return updatedTxn;
        },

        /**
         * DELETE /api/transactions/{id}
         * Delete a transaction
         * @param {string} id - Transaction ID
         * @returns {Promise<void>}
         */
        delete: async (id: string): Promise<void> => {
            await delay(500);
            const txns = loadData('transactions_v2', initialTransactions);
            const filtered = txns.filter(t => t.id !== id);
            saveData('transactions_v2', filtered);
        }
    },

    // INSPECTIONS
    inspections: {
        /**
         * GET /api/inspections
         * Fetch all inspections
         * @returns {Promise<Inspection[]>} List of inspections
         */
        getAll: async (): Promise<Inspection[]> => {
            await delay(400);
            return loadData('inspections_v2', initialInspections);
        },

        /**
         * POST /api/inspections
         * Create a new inspection
         * @param {Omit<Inspection, 'id'>} inspection - Inspection data
         * @returns {Promise<Inspection>} Created inspection
         */
        create: async (inspection: Omit<Inspection, 'id'>): Promise<Inspection> => {
            await delay(700);
            const inspections = loadData('inspections_v2', initialInspections);
            const newInspection = { ...inspection, id: `INS-${Date.now()}` };
            saveData('inspections_v2', [...inspections, newInspection]);
            return newInspection;
        },

        /**
         * PATCH /api/inspections/{id}
         * Update an inspection
         * @param {string} id - Inspection ID
         * @param {Partial<Inspection>} updates - Fields to update
         * @returns {Promise<Inspection>} Updated inspection
         */
        update: async (id: string, updates: Partial<Inspection>): Promise<Inspection> => {
            await delay(600);
            const inspections = loadData('inspections_v2', initialInspections);
            const index = inspections.findIndex(i => i.id === id);
            if (index === -1) throw new Error('Inspection not found');

            const updatedInspection = { ...inspections[index], ...updates };
            inspections[index] = updatedInspection;
            saveData('inspections_v2', inspections);
            return updatedInspection;
        },

        /**
         * DELETE /api/inspections/{id}
         * Delete an inspection
         * @param {string} id - Inspection ID
         * @returns {Promise<void>}
         */
        delete: async (id: string): Promise<void> => {
            await delay(500);
            const inspections = loadData('inspections_v2', initialInspections);
            const filtered = inspections.filter(i => i.id !== id);
            saveData('inspections_v2', filtered);
        }
    },

    // DOCUMENTS
    documents: {
        /**
         * GET /api/documents
         * Fetch all documents
         * @returns {Promise<Document[]>} List of documents
         */
        getAll: async (): Promise<Document[]> => {
            await delay(400);
            return loadData('documents_v2', initialDocuments);
        },

        /**
         * POST /api/documents
         * Upload/Create a new document record
         * @param {Omit<Document, 'id'>} document - Document data
         * @returns {Promise<Document>} Created document
         */
        create: async (document: Omit<Document, 'id'>): Promise<Document> => {
            await delay(700);
            const documents = loadData('documents_v2', initialDocuments);
            const newDocument = { ...document, id: `DOC-${Date.now()}` };
            saveData('documents_v2', [...documents, newDocument]);
            return newDocument;
        },

        /**
         * DELETE /api/documents/{id}
         * Delete a document
         * @param {string} id - Document ID
         * @returns {Promise<void>}
         */
        delete: async (id: string): Promise<void> => {
            await delay(500);
            const documents = loadData('documents_v2', initialDocuments);
            const filtered = documents.filter(d => d.id !== id);
            saveData('documents_v2', filtered);
        }
    },

    // ALERTS
    alerts: {
        /**
         * GET /api/alerts
         * Fetch all alerts
         * @returns {Promise<Alert[]>} List of alerts
         */
        getAll: async (): Promise<Alert[]> => {
            await delay(300);
            return loadData('alerts_v2', initialAlerts);
        },

        /**
         * POST /api/alerts
         * Create a new alert
         * @param {Omit<Alert, 'id'>} alert - Alert data
         * @returns {Promise<Alert>} Created alert
         */
        create: async (alert: Omit<Alert, 'id'>): Promise<Alert> => {
            await delay(600);
            const alerts = loadData('alerts_v2', initialAlerts);
            const newAlert = { ...alert, id: `ALT-${Date.now()}` };
            saveData('alerts_v2', [...alerts, newAlert]);
            return newAlert;
        },

        /**
         * PATCH /api/alerts/{id}
         * Update an alert
         * @param {string} id - Alert ID
         * @param {Partial<Alert>} updates - Fields to update
         * @returns {Promise<Alert>} Updated alert
         */
        update: async (id: string, updates: Partial<Alert>): Promise<Alert> => {
            await delay(500);
            const alerts = loadData('alerts_v2', initialAlerts);
            const index = alerts.findIndex(a => a.id === id);
            if (index === -1) throw new Error('Alert not found');

            const updatedAlert = { ...alerts[index], ...updates };
            alerts[index] = updatedAlert;
            saveData('alerts_v2', alerts);
            return updatedAlert;
        },

        /**
         * DELETE /api/alerts/{id}
         * Delete an alert
         * @param {string} id - Alert ID
         * @returns {Promise<void>}
         */
        delete: async (id: string): Promise<void> => {
            await delay(400);
            const alerts = loadData('alerts_v2', initialAlerts);
            const filtered = alerts.filter(a => a.id !== id);
            saveData('alerts_v2', filtered);
        }
    },

    // USERS (ADMIN)
    users: {
        /**
         * GET /api/users
         * Fetch all users (Admin only)
         * @returns {Promise<User[]>} List of users
         */
        getAll: async (): Promise<User[]> => {
            await delay(500);
            return loadData('users_v2', initialUsers);
        },

        /**
         * POST /api/users
         * Create a new user
         * @param {Omit<User, 'id'>} user - User data
         * @returns {Promise<User>} Created user
         */
        create: async (user: Omit<User, 'id'>): Promise<User> => {
            await delay(800);
            const users = loadData('users_v2', initialUsers);
            const newUser = { ...user, id: `USR-${Date.now()}` };
            saveData('users_v2', [...users, newUser]);
            return newUser;
        },

        /**
         * PATCH /api/users/{id}
         * Update a user
         * @param {string} id - User ID
         * @param {Partial<User>} updates - Fields to update
         * @returns {Promise<User>} Updated user
         */
        update: async (id: string, updates: Partial<User>): Promise<User> => {
            await delay(600);
            const users = loadData('users_v2', initialUsers);
            const index = users.findIndex(u => u.id === id);
            if (index === -1) throw new Error('User not found');

            const updatedUser = { ...users[index], ...updates };
            users[index] = updatedUser;
            saveData('users_v2', users);
            return updatedUser;
        },

        /**
         * DELETE /api/users/{id}
         * Delete a user
         * @param {string} id - User ID
         * @returns {Promise<void>}
         */
        delete: async (id: string): Promise<void> => {
            await delay(500);
            const users = loadData('users_v2', initialUsers);
            const filtered = users.filter(u => u.id !== id);
            saveData('users_v2', filtered);
        }
    },

    // MILESTONES
    milestones: {
        /**
         * GET /api/milestones
         * Fetch all milestones
         * @returns {Promise<Milestone[]>} List of milestones
         */
        getAll: async (): Promise<Milestone[]> => {
            await delay(300);
            return loadData('milestones_v2', initialMilestones);
        },

        /**
         * POST /api/milestones
         * Create a new milestone
         * @param {Omit<Milestone, 'id'>} milestone - Milestone data
         * @returns {Promise<Milestone>} Created milestone
         */
        create: async (milestone: Omit<Milestone, 'id'>): Promise<Milestone> => {
            await delay(600);
            const milestones = loadData('milestones_v2', initialMilestones);
            const newMilestone = { ...milestone, id: `MS-${Date.now()}` };
            saveData('milestones_v2', [...milestones, newMilestone]);
            return newMilestone;
        },

        /**
         * PATCH /api/milestones/{id}
         * Update a milestone
         * @param {string} id - Milestone ID
         * @param {Partial<Milestone>} updates - Fields to update
         * @returns {Promise<Milestone>} Updated milestone
         */
        update: async (id: string, updates: Partial<Milestone>): Promise<Milestone> => {
            await delay(500);
            const milestones = loadData('milestones_v2', initialMilestones);
            const index = milestones.findIndex(m => m.id === id);
            if (index === -1) throw new Error('Milestone not found');

            const updatedMilestone = { ...milestones[index], ...updates };
            milestones[index] = updatedMilestone;
            saveData('milestones_v2', milestones);
            return updatedMilestone;
        },

        /**
         * DELETE /api/milestones/{id}
         * Delete a milestone
         * @param {string} id - Milestone ID
         * @returns {Promise<void>}
         */
        delete: async (id: string): Promise<void> => {
            await delay(400);
            const milestones = loadData('milestones_v2', initialMilestones);
            const filtered = milestones.filter(m => m.id !== id);
            saveData('milestones_v2', filtered);
        }
    }
};
