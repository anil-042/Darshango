import { z } from 'zod';

export const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['Admin', 'StateNodalOfficer', 'DistrictOfficer', 'AgencyAdmin', 'Inspector', 'Viewer']).optional(),
    agencyId: z.string().optional(),
    state: z.string().optional(),
    district: z.string().optional(),
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
    progress: z.number().min(0).max(100),
    estimatedCost: z.number().positive(),
    location: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional(),
});

export const agencySchema = z.object({
    name: z.string().min(2),
    code: z.string().optional(),
    type: z.string().optional(),
    role: z.string().optional(),
    state: z.string().optional(),
    district: z.string().optional(),
    contactPerson: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    components: z.array(z.string()).optional(),
});

export const fundSchema = z.object({
    type: z.enum(['Release', 'Adjustment', 'Utilization']),
    amount: z.number().positive(),
    utr: z.string().optional(),
    date: z.string(),
    status: z.enum(['Completed', 'Pending', 'Processing', 'Failed']),
    description: z.string().optional(),
});

export const inspectionSchema = z.object({
    inspectorName: z.string(),
    date: z.string(),
    status: z.enum(['Scheduled', 'Completed', 'Pending']),
    rating: z.enum(['Good', 'Satisfactory', 'Needs Attention', 'Pending']).optional(),
    comments: z.string().optional(),
    findings: z.string().optional(),
    geoLocation: z.string().optional(),
    images: z.array(z.string()).optional(),
});

export const documentSchema = z.object({
    title: z.string(),
    type: z.string(),
    uploadedBy: z.string(),
    uploadDate: z.string(),
    size: z.string(),
    url: z.string(),
    category: z.string().optional(),
    status: z.enum(['Pending', 'Verified', 'Rejected']).optional(),
    agencyId: z.string().optional(),
});

export const milestoneSchema = z.object({
    title: z.string(),
    status: z.enum(['Pending', 'In Progress', 'Completed']),
    owner: z.string(),
    dueDate: z.string(),
    completionDate: z.string().nullable().optional(),
    progress: z.number().min(0).max(100),
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
