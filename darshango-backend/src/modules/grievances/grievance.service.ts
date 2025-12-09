import { supabase } from '../../config/supabase';

export const createGrievance = async (data: any) => {
    // 1. Calculate SLA (Default 7 days)
    const slaDate = new Date();
    slaDate.setDate(slaDate.getDate() + 7);

    const dbGrievance = {
        project_id: data.projectId || null, // Allow null
        is_general: data.isGeneral || false,

        // Fields based on mode
        type: data.type, // Project specific
        category: data.category, // General specific
        level: data.level, // General specific

        component: data.component, // Auto-filled from project
        district: data.district, // Auto-filled from project or manual

        source: data.source || 'Public',
        priority: data.priority || 'Normal',
        status: 'Pending',
        description: data.description,

        sla_due_date: slaDate.toISOString(),
        sla_status: 'On Track',

        created_by: data.createdBy,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    // 2. Logic: If High Priority & certain types -> Trigger System Alert
    if (data.priority === 'High' && ['Project Delay', 'Fund Misuse', 'Corruption'].includes(data.type)) {
        // We would call AlertService.createAlert(...) here
        // For now, let's just log or assume the Alert module handles it via triggers or we invoke it if AlertService was imported
        console.log("High Priority Grievance - Should Trigger Alert");
    }

    const { data: newGrievance, error } = await supabase
        .from('grievances')
        .insert([dbGrievance])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapGrievance(newGrievance);
};

export const getAllGrievances = async (filters: any = {}) => {
    let query = supabase
        .from('grievances')
        .select(`
            *,
            project:projects(title),
            creator:users!grievances_created_by_fkey(name, email),
            assignee:users!grievances_assigned_to_fkey(name, email)
        `);

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.priority) query = query.eq('priority', filters.priority);
    if (filters.projectId) query = query.eq('project_id', filters.projectId);
    if (filters.district) query = query.eq('district', filters.district);
    if (filters.component) query = query.eq('component', filters.component);
    if (filters.source) query = query.eq('source', filters.source);
    if (filters.isGeneral !== undefined) query = query.eq('is_general', filters.isGeneral);

    // Custom filtering for type/category
    if (filters.type) query = query.eq('type', filters.type); // Project mode
    if (filters.category) query = query.eq('category', filters.category); // General mode

    if (filters.assignedTo) query = query.eq('assigned_to', filters.assignedTo);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(mapGrievance);
};

export const getGrievanceById = async (id: string) => {
    const { data, error } = await supabase
        .from('grievances')
        .select(`
            *,
            project:projects(title),
            creator:users!grievances_created_by_fkey(name, email, role),
            assignee:users!grievances_assigned_to_fkey(name, email, role)
        `)
        .eq('id', id)
        .single();

    if (error) return null;
    return mapGrievance(data);
};

export const updateGrievance = async (id: string, updates: any) => {
    const dbUpdates: any = {
        updated_at: new Date().toISOString()
    };

    if (updates.status) {
        dbUpdates.status = updates.status;
        if (updates.status === 'Reopened') {
            dbUpdates.reopened_at = new Date().toISOString();
        }
    }
    if (updates.assignedTo) dbUpdates.assigned_to = updates.assignedTo;
    if (updates.resolution) dbUpdates.resolution = updates.resolution;
    if (updates.priority) dbUpdates.priority = updates.priority;
    if (updates.verifiedBy) {
        dbUpdates.verified_by = updates.verifiedBy;
        dbUpdates.verified_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from('grievances')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapGrievance(data);
};

export const deleteGrievance = async (id: string) => {
    const { error } = await supabase
        .from('grievances')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
};

const mapGrievance = (g: any) => ({
    id: g.id,
    projectId: g.project_id,
    projectName: g.project?.title,
    isGeneral: g.is_general,

    type: g.type,
    category: g.category,
    level: g.level,
    component: g.component,
    district: g.district,
    source: g.source,

    priority: g.priority,
    status: g.status,
    description: g.description,
    resolution: g.resolution,

    assignedTo: g.assigned_to,
    assigneeName: g.assignee?.name,

    verifiedBy: g.verified_by,
    verifiedAt: g.verified_at,
    reopenedAt: g.reopened_at,

    slaDueDate: g.sla_due_date,
    slaStatus: g.sla_status,

    createdBy: g.created_by,
    creatorName: g.creator?.name,
    attachments: g.attachments,
    createdAt: g.created_at,
    updatedAt: g.updated_at
});
