import {
    Project,
    Agency,
    Transaction,
    Inspection,
    Document,
    Alert,
    User
} from '../types';

// Initial Seed Data
export const initialProjects: Project[] = [
    {
        id: 'AG-2024-001',
        component: 'Adarsh Gram',
        title: 'Adarsh Gram Development - Village Rampur',
        implementingAgencyId: 'PRI-UP-034',
        executingAgencyId: 'PWD-UP-001',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        status: 'In Progress',
        progress: 75,
        estimatedCost: 25000000,
        location: { lat: 26.8467, lng: 80.9462 }
    },
    {
        id: 'HST-2024-023',
        component: 'Hostel',
        title: 'Girls Hostel Construction - Bhopal',
        implementingAgencyId: 'SD-MP-045',
        executingAgencyId: 'PWD-MP-067',
        state: 'Madhya Pradesh',
        district: 'Bhopal',
        startDate: '2024-03-01',
        endDate: '2025-06-30',
        status: 'In Progress',
        progress: 45,
        estimatedCost: 45000000,
        location: { lat: 23.2599, lng: 77.4126 }
    },
    {
        id: 'GIA-2024-156',
        component: 'GIA',
        title: 'Grant-in-Aid Infrastructure - Mumbai',
        implementingAgencyId: 'SD-MH-045',
        executingAgencyId: 'NGO-MH-012',
        state: 'Maharashtra',
        district: 'Mumbai',
        startDate: '2024-02-10',
        endDate: '2024-11-30',
        status: 'Under Review',
        progress: 30,
        estimatedCost: 15000000,
        location: { lat: 19.0760, lng: 72.8777 }
    },
    {
        id: 'AG-2024-087',
        component: 'Adarsh Gram',
        title: 'Adarsh Gram Development - Village Kheda',
        implementingAgencyId: 'PRI-GJ-012',
        executingAgencyId: 'NGO-GJ-012',
        state: 'Gujarat',
        district: 'Ahmedabad',
        startDate: '2023-09-20',
        endDate: '2024-08-15',
        status: 'Completed',
        progress: 100,
        estimatedCost: 20000000,
        location: { lat: 23.0225, lng: 72.5714 }
    },
    {
        id: 'HST-2024-034',
        component: 'Hostel',
        title: 'Boys Hostel Renovation - Jaipur',
        implementingAgencyId: 'SD-RJ-023',
        executingAgencyId: 'PWD-RJ-001',
        state: 'Rajasthan',
        district: 'Jaipur',
        startDate: '2024-04-05',
        endDate: '2024-12-20',
        status: 'In Progress',
        progress: 60,
        estimatedCost: 12000000,
        location: { lat: 26.9124, lng: 75.7873 }
    }
];

export const initialAgencies: Agency[] = [
    {
        id: 'PWD-RJ-001',
        name: 'Public Works Department Rajasthan',
        code: 'PWD-RJ-001',
        type: 'Implementing',
        role: 'Implementing',
        state: 'Rajasthan',
        district: 'Jaipur',
        contactPerson: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        email: 'pwd.raj@gov.in',
        address: 'PWD HQ, Jaipur',
        assignedProjects: ['HST-2024-034'],
        components: ['Hostel', 'Adarsh Gram'],
        activeProjects: 12,
        performance: 85,
        lastUpdated: '2024-11-15'
    },
    {
        id: 'NGO-GJ-012',
        name: 'Gujarat Social Development Foundation',
        code: 'NGO-GJ-012',
        type: 'Executing',
        role: 'Executing',
        state: 'Gujarat',
        district: 'Ahmedabad',
        contactPerson: 'Priya Shah',
        phone: '+91 98765 43211',
        email: 'gsdf@ngo.org',
        address: 'Navrangpura, Ahmedabad',
        assignedProjects: ['AG-2024-087'],
        components: ['Adarsh Gram'],
        activeProjects: 5,
        performance: 92,
        lastUpdated: '2024-11-18'
    },
    {
        id: 'PRI-UP-034',
        name: 'Uttar Pradesh Panchayati Raj',
        code: 'PRI-UP-034',
        type: 'Implementing',
        role: 'Implementing',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        contactPerson: 'Amit Verma',
        phone: '+91 98765 43212',
        email: 'pri.up@gov.in',
        address: 'Vikas Bhawan, Lucknow',
        assignedProjects: ['AG-2024-001'],
        components: ['Adarsh Gram', 'GIA'],
        activeProjects: 8,
        performance: 78,
        lastUpdated: '2024-11-20'
    },
    {
        id: 'SD-MH-045',
        name: 'Maharashtra State Department',
        code: 'SD-MH-045',
        type: 'Implementing',
        role: 'Implementing',
        state: 'Maharashtra',
        district: 'Mumbai',
        contactPerson: 'Sunita Patil',
        phone: '+91 98765 43213',
        email: 'msd@gov.in',
        address: 'Mantralaya, Mumbai',
        assignedProjects: ['GIA-2024-156'],
        components: ['GIA'],
        activeProjects: 15,
        performance: 88,
        lastUpdated: '2024-11-10'
    },
    {
        id: 'PWD-MP-067',
        name: 'Madhya Pradesh PWD',
        code: 'PWD-MP-067',
        type: 'Executing',
        role: 'Executing',
        state: 'Madhya Pradesh',
        district: 'Bhopal',
        contactPerson: 'Vijay Singh',
        phone: '+91 98765 43214',
        email: 'pwd.mp@gov.in',
        address: 'Satpura Bhawan, Bhopal',
        assignedProjects: ['HST-2024-023'],
        components: ['Hostel'],
        activeProjects: 7,
        performance: 82,
        lastUpdated: '2024-11-12'
    }
];

export const initialTransactions: Transaction[] = [
    {
        id: 'TXN-2024-001',
        projectId: 'AG-2024-001',
        type: 'Release',
        amount: 15000000,
        utr: 'UTR2024001234567',
        date: '2024-01-20',
        status: 'Completed',
        description: 'First installment release'
    },
    {
        id: 'TXN-2024-045',
        projectId: 'HST-2024-023',
        type: 'Release',
        amount: 20000000,
        utr: 'UTR2024001234890',
        date: '2024-04-15',
        status: 'Completed',
        description: 'Second installment release'
    }
];

export const initialInspections: Inspection[] = [
    {
        id: 'INS-2024-001',
        projectId: 'AG-2024-001',
        inspectorName: 'A. K. Sharma',
        date: '2024-03-15',
        status: 'Completed',
        rating: 'Satisfactory',
        comments: 'Work progressing well.',
        location: 'Village Rampur'
    }
];

export const initialDocuments: Document[] = [
    {
        id: 'DOC-001',
        title: 'Project Proposal',
        type: 'Proposal',
        projectId: 'AG-2024-001',
        uploadedBy: 'Admin',
        uploadDate: '2024-01-10',
        size: '2.4 MB',
        url: '#',
        category: 'Planning'
    }
];

export const initialAlerts: Alert[] = [
    {
        id: 'ALT-001',
        type: 'Delayed Milestone',
        projectId: 'AG-2024-001',
        priority: 'High',
        description: 'Phase 1 delayed by 10 days',
        status: 'Open',
        date: '2024-11-18'
    }
];

export const initialMilestones: any[] = [
    {
        id: 'MS-001',
        projectId: 'AG-2024-001',
        title: 'Project Approval & Planning',
        status: 'Completed',
        owner: 'Project Manager',
        dueDate: '2024-01-30',
        completionDate: '2024-01-28',
        progress: 100
    },
    {
        id: 'MS-002',
        projectId: 'AG-2024-001',
        title: 'Site Preparation & Groundwork',
        status: 'Completed',
        owner: 'Civil Engineer',
        dueDate: '2024-03-15',
        completionDate: '2024-03-12',
        progress: 100
    },
    {
        id: 'MS-003',
        projectId: 'AG-2024-001',
        title: 'Water Supply System Installation',
        status: 'Completed',
        owner: 'Technical Team',
        dueDate: '2024-05-30',
        completionDate: '2024-05-28',
        progress: 100
    },
    {
        id: 'MS-004',
        projectId: 'AG-2024-001',
        title: 'Community Center Construction',
        status: 'In Progress',
        owner: 'Construction Team',
        dueDate: '2024-08-31',
        completionDate: null,
        progress: 65
    }
];

export const initialUsers: User[] = [
    {
        id: 'USR-001',
        name: 'Admin User',
        email: 'admin@pmajay.gov.in',
        role: 'Admin',
        status: 'Active',
        password: 'admin123'
    },
    {
        id: 'USR-002',
        name: 'State Officer UP',
        email: 'so.up@pmajay.gov.in',
        role: 'StateNodalOfficer',
        state: 'Uttar Pradesh',
        status: 'Active',
        password: 'user123'
    },
    {
        id: 'USR-003',
        name: 'Agency Admin',
        email: 'agency@pmajay.gov.in',
        role: 'AgencyAdmin',
        agencyId: 'PWD-RJ-001',
        status: 'Active',
        password: 'user123'
    }
];
