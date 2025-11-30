export interface Project {
    id: string;
    projectId: string;
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
    category: 'PWD' | 'StateDept' | 'PRI' | 'ULB' | 'DevelopmentAuthority' | 'HousingBoard' | 'EngineeringDept' | 'NGO' | 'PrivateContractor' | 'OtherGovtAgency';
    roleType: 'Implementing' | 'Executing';
    state: string;
    district: string;
    address: string;
    contactPerson: string;
    designation?: string;
    phone: string;
    email: string;
    registrationNumber?: string;
    gstin?: string;
    website?: string;
    remarks?: string;
    assignedProjects: string[];
    components: string[];
    activeProjects: number;
    performance: number;
    lastUpdated: string;
}

export interface Transaction {
    id: string;
    projectId: string;
    type: 'Ministry Allocation' | 'State Transfer' | 'District Allocation' | 'Agency Release' | 'Utilization';
    fromLevel: 'Ministry' | 'State' | 'District' | 'Agency' | 'Ground';
    toLevel: 'State' | 'District' | 'Agency' | 'Ground';
    amount: number;
    date: string;
    status: 'Pending' | 'Completed' | 'Approved' | 'Failed';
    utrNumber?: string;
    description?: string;
    proofFile?: string; // URL
    createdBy?: string;
    createdAt?: string;
    state?: string;
    district?: string;
    agencyId?: string;
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
    status: 'Pending' | 'In Progress' | 'Partially Completed' | 'Nearly Completed' | 'Completed';
    owner: string;
    startDate?: string;
    dueDate: string;
    completionDate?: string;
    progress: number;
    remarks?: string;
    orderIndex?: number;
    createdAt?: string;
    updatedAt?: string;
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
