import { z } from 'zod';

export const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['Admin', 'StateNodalOfficer', 'DistrictOfficer', 'AgencyAdmin', 'Inspector', 'Viewer']).optional(),
    agencyId: z.string().optional(),
    state: z.string().optional(),
    district: z.string().optional(),
    phone: z.string().optional(),
    designation: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const projectSchema = z.object({
    title: z.string().min(3),
    component: z.enum(['Adarsh Gram', 'GIA', 'Hostel']),
    implementingAgencyId: z.string(),
    executingAgencyId: z.string(),
    state: z.string(),
    district: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.enum(['In Progress', 'Completed', 'Under Review', 'Delayed']),
    progress: z.number().min(0).max(100).optional(),
    estimatedCost: z.number().nonnegative(),
    location: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
});

export const agencySchema = z.object({
    name: z.string().min(2),
    code: z.string().optional(),
    category: z.enum(['PWD', 'StateDept', 'PRI', 'ULB', 'DevelopmentAuthority', 'HousingBoard', 'EngineeringDept', 'NGO', 'PrivateContractor', 'OtherGovtAgency']),
    roleType: z.enum(['Implementing', 'Executing']),
    state: z.string().optional(),
    district: z.string().optional(),
    address: z.string().optional(),
    contactPerson: z.string().optional(),
    designation: z.string().optional(),
    phone: z.string().optional(),
    email: z.union([z.string().email(), z.literal('')]).optional(),
    registrationNumber: z.string().optional().nullable(),
    gstin: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
    remarks: z.string().optional().nullable(),
    components: z.array(z.string()).optional(),
    assignedProjects: z.array(z.string()).optional(),
    activeProjects: z.number().optional(),
    performance: z.number().optional(),
    lastUpdated: z.string().optional(),
});

export const fundSchema = z.object({
    projectId: z.string().optional(),
    type: z.enum(['Release', 'Adjustment', 'Utilization']),
    amount: z.number().positive(),
    utr: z.string().optional(),
    transactionDate: z.string(),
    status: z.enum(['Completed', 'Pending', 'Processing', 'Failed']),
    description: z.string().optional(),
    ucStatus: z.enum(['Pending', 'Submitted', 'Approved']).optional(),
    ucDocumentUrl: z.string().optional(),
});

export const inspectionSchema = z.object({
    inspectorName: z.string(),
    date: z.string(),
    status: z.enum(['Scheduled', 'Completed', 'Pending']),
    rating: z.enum(['Good', 'Satisfactory', 'Needs Attention', 'Pending', 'Critical']).optional(),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    comments: z.string().optional(),
    findings: z.string().optional(),
    checklist: z.array(z.object({
        question: z.string(),
        answer: z.boolean(),
        remarks: z.string().optional()
    })).optional(),
    geoLocation: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional(),
    images: z.array(z.string()).optional(),
});

export const documentSchema = z.object({
    title: z.string(),
    type: z.string(),
    uploadedBy: z.string(),
    uploadDate: z.string(),
    size: z.string().optional(),
    url: z.string(),
    category: z.string().optional(),
    status: z.enum(['Pending', 'Verified', 'Rejected']).optional(),
    agencyId: z.string().optional(),
    version: z.number().optional(),
    linkedEntityId: z.string().optional(), // Milestone ID or Fund ID
    linkedEntityType: z.enum(['Milestone', 'Fund', 'Project']).optional(),
});

export const milestoneSchema = z.object({
    title: z.string(),
    status: z.enum(['Pending', 'In Progress', 'Completed']),
    owner: z.string().optional(),
    startDate: z.string().optional(),
    dueDate: z.string(),
    completionDate: z.string().nullable().optional(),
    progress: z.number().min(0).max(100),
    remarks: z.string().optional(),
    orderIndex: z.number().optional(),
});

export const alertSchema = z.object({
    type: z.string(),
    projectId: z.string(),
    priority: z.enum(['High', 'Medium', 'Low']),
    description: z.string(),
    status: z.enum(['Open', 'In Progress', 'Resolved', 'New', 'Investigating']),
    date: z.string(),
});

export const validate = (schema: z.ZodSchema) => (req: any, res: any, next: any) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: error.errors,
        });
    }
};
