"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.alertSchema = exports.milestoneSchema = exports.documentSchema = exports.inspectionSchema = exports.fundSchema = exports.agencySchema = exports.projectSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['Admin', 'StateNodalOfficer', 'DistrictOfficer', 'AgencyAdmin', 'Inspector', 'Viewer']).optional(),
    agencyId: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    district: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    designation: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.projectSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    component: zod_1.z.enum(['Adarsh Gram', 'GIA', 'Hostel']),
    implementingAgencyId: zod_1.z.string(),
    executingAgencyId: zod_1.z.string(),
    state: zod_1.z.string(),
    district: zod_1.z.string(),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    status: zod_1.z.enum(['In Progress', 'Completed', 'Under Review', 'Delayed']),
    progress: zod_1.z.number().min(0).max(100).optional(),
    estimatedCost: zod_1.z.number().positive(),
    location: zod_1.z.object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number()
    }).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    description: zod_1.z.string().optional(),
});
exports.agencySchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    code: zod_1.z.string().optional(),
    type: zod_1.z.enum(['Implementing', 'Executing']).optional(),
    role: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    district: zod_1.z.string().optional(),
    contactPerson: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    address: zod_1.z.string().optional(),
    componentsHandled: zod_1.z.array(zod_1.z.string()).optional(),
    assignedProjects: zod_1.z.array(zod_1.z.string()).optional(),
    activeProjects: zod_1.z.number().optional(),
    performance: zod_1.z.number().optional(),
    lastUpdated: zod_1.z.string().optional(),
});
exports.fundSchema = zod_1.z.object({
    projectId: zod_1.z.string().optional(),
    type: zod_1.z.enum(['Release', 'Adjustment', 'Utilization']),
    amount: zod_1.z.number().positive(),
    utr: zod_1.z.string().optional(),
    transactionDate: zod_1.z.string(),
    status: zod_1.z.enum(['Completed', 'Pending', 'Processing', 'Failed']),
    description: zod_1.z.string().optional(),
    ucStatus: zod_1.z.enum(['Pending', 'Submitted', 'Approved']).optional(),
    ucDocumentUrl: zod_1.z.string().optional(),
});
exports.inspectionSchema = zod_1.z.object({
    inspectorName: zod_1.z.string(),
    date: zod_1.z.string(),
    status: zod_1.z.enum(['Scheduled', 'Completed', 'Pending']),
    rating: zod_1.z.enum(['Good', 'Satisfactory', 'Needs Attention', 'Pending', 'Critical']).optional(),
    severity: zod_1.z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    comments: zod_1.z.string().optional(),
    findings: zod_1.z.string().optional(),
    checklist: zod_1.z.array(zod_1.z.object({
        question: zod_1.z.string(),
        answer: zod_1.z.boolean(),
        remarks: zod_1.z.string().optional()
    })).optional(),
    geoLocation: zod_1.z.object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number()
    }).optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.documentSchema = zod_1.z.object({
    title: zod_1.z.string(),
    type: zod_1.z.string(),
    uploadedBy: zod_1.z.string(),
    uploadDate: zod_1.z.string(),
    size: zod_1.z.string().optional(),
    url: zod_1.z.string(),
    category: zod_1.z.string().optional(),
    status: zod_1.z.enum(['Pending', 'Verified', 'Rejected']).optional(),
    agencyId: zod_1.z.string().optional(),
    version: zod_1.z.number().optional(),
    linkedEntityId: zod_1.z.string().optional(), // Milestone ID or Fund ID
    linkedEntityType: zod_1.z.enum(['Milestone', 'Fund', 'Project']).optional(),
});
exports.milestoneSchema = zod_1.z.object({
    title: zod_1.z.string(),
    status: zod_1.z.enum(['Pending', 'In Progress', 'Completed']),
    owner: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    dueDate: zod_1.z.string(),
    completionDate: zod_1.z.string().nullable().optional(),
    progress: zod_1.z.number().min(0).max(100),
    remarks: zod_1.z.string().optional(),
    orderIndex: zod_1.z.number().optional(),
});
exports.alertSchema = zod_1.z.object({
    type: zod_1.z.string(),
    projectId: zod_1.z.string(),
    priority: zod_1.z.enum(['High', 'Medium', 'Low']),
    description: zod_1.z.string(),
    status: zod_1.z.enum(['Open', 'In Progress', 'Resolved', 'New', 'Investigating']),
    date: zod_1.z.string(),
});
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: error.errors,
        });
    }
};
exports.validate = validate;
