export interface Project {
    id: string;
    component: 'Adarsh Gram' | 'GIA' | 'Hostel';
    title: string;
    implementingAgencyId: string;
    executingAgencyId: string;
    state: string;
    district: string;
    startDate: string;
    endDate: string;
    status: 'In Progress' | 'Completed' | 'Under Review' | 'Delayed';
    progress: number;
    estimatedCost: number;
    location?: { lat: number; lng: number };
}

export interface Agency {
    id: string;
    name: string;
    code: string;
    type: string; // Changed from union to string to support NGO, PWD etc.
    role: string;
    state: string;
    district: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    assignedProjects: string[];
    components: string[];
    activeProjects: number;
    performance: number;
    lastUpdated: string;
}

export interface Transaction {
    id: string;
    projectId: string;
    type: 'Release' | 'Adjustment' | 'Utilization';
    amount: number;
    utr: string;
    date: string;
    status: 'Completed' | 'Pending' | 'Processing' | 'Failed';
    description?: string;
}

export interface Inspection {
    id: string;
    projectId: string;
    inspectorName: string;
    date: string;
    status: 'Scheduled' | 'Completed' | 'Pending';
    rating: 'Good' | 'Satisfactory' | 'Needs Attention' | 'Pending';
    comments: string;
    inspectorId?: string;
    findings?: string;
    geoLocation?: string;
    location?: string;
    images?: string[];
    detailedReview?: string;
}

export interface Document {
    id: string;
    title: string;
    type: string;
    projectId?: string;
    agencyId?: string;
    uploadedBy: string;
    uploadDate: string;
    size: string;
    url: string;
    category?: string;
    status?: 'Pending' | 'Verified' | 'Rejected';
}

export interface Alert {
    id: string;
    type: string;
    projectId: string;
    priority: 'High' | 'Medium' | 'Low';
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'New' | 'Investigating'; // Added New/Investigating
    date: string;
    severity?: 'High' | 'Medium' | 'Low'; // Optional alias for priority if needed
    message?: string; // Optional alias for description
}

export interface Milestone {
    id: string;
    projectId: string;
    title: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    owner: string;
    dueDate: string;
    completionDate?: string | null;
    progress: number;
}

export type UserRole = 'Admin' | 'StateNodalOfficer' | 'DistrictOfficer' | 'AgencyAdmin' | 'Inspector' | 'Viewer';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    state?: string;
    district?: string;
    agencyId?: string;
    status: 'Active' | 'Pending' | 'Inactive';
    password?: string; // For mock auth only
}
