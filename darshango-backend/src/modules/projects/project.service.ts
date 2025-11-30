import { supabase } from '../../config/supabase';

export const createProject = async (projectData: any) => {
    // Map camelCase to snake_case
    const dbProject = {
        project_id: projectData.projectId,
        title: projectData.title,
        component: projectData.component,
        implementing_agency_id: projectData.implementingAgencyId,
        executing_agency_id: projectData.executingAgencyId,
        state: projectData.state,
        district: projectData.district,
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        status: projectData.status,
        progress: 0,
        estimated_cost: projectData.estimatedCost,
        location_lat: projectData.location?.lat,
        location_lng: projectData.location?.lng,
        tags: projectData.tags,
        description: projectData.description,
        total_funds_released: 0,
        total_funds_utilized: 0,
        pending_ucs: 0,
        milestone_count: 0,
        inspection_count: 0,
        document_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('projects')
        .insert([dbProject])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapProject(data);
};

export const getAllProjects = async (filters: any = {}) => {
    let query = supabase.from('projects').select('*');

    if (filters.state) query = query.eq('state', filters.state);
    if (filters.district) query = query.eq('district', filters.district);
    if (filters.agencyId) query = query.eq('implementing_agency_id', filters.agencyId);
    if (filters.component) query = query.eq('component', filters.component);
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error } = await query.order('updated_at', { ascending: false });

    if (error) {
        console.error("[ProjectService] Error in getAllProjects:", error);
        throw new Error(error.message);
    }

    console.log(`[ProjectService] Found ${data.length} projects in DB`);
    return data.map(mapProject);
};

export const getProjectById = async (id: string) => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return mapProject(data);
};

export const updateProject = async (id: string, updateData: any) => {
    const dbUpdate: any = {
        updated_at: new Date().toISOString()
    };

    if (updateData.projectId) dbUpdate.project_id = updateData.projectId;
    if (updateData.title) dbUpdate.title = updateData.title;
    if (updateData.component) dbUpdate.component = updateData.component;
    if (updateData.implementingAgencyId) dbUpdate.implementing_agency_id = updateData.implementingAgencyId;
    if (updateData.executingAgencyId) dbUpdate.executing_agency_id = updateData.executingAgencyId;
    if (updateData.state) dbUpdate.state = updateData.state;
    if (updateData.district) dbUpdate.district = updateData.district;
    if (updateData.startDate) dbUpdate.start_date = updateData.startDate;
    if (updateData.endDate) dbUpdate.end_date = updateData.endDate;
    if (updateData.status) dbUpdate.status = updateData.status;
    if (updateData.progress !== undefined) dbUpdate.progress = updateData.progress;
    if (updateData.estimatedCost) dbUpdate.estimated_cost = updateData.estimatedCost;
    if (updateData.location) {
        dbUpdate.location_lat = updateData.location.lat;
        dbUpdate.location_lng = updateData.location.lng;
    }
    if (updateData.tags) dbUpdate.tags = updateData.tags;
    if (updateData.description) dbUpdate.description = updateData.description;

    const { data, error } = await supabase
        .from('projects')
        .update(dbUpdate)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapProject(data);
};

export const deleteProject = async (id: string) => {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
};

export const recalculateProjectStats = async (projectId: string) => {
    // Milestones
    const { data: milestones } = await supabase
        .from('milestones')
        .select('status')
        .eq('project_id', projectId);

    const totalMilestones = milestones?.length || 0;
    const completedMilestones = milestones?.filter(m => m.status === 'Completed').length || 0;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    // Funds
    const { data: funds } = await supabase
        .from('funds')
        .select('type, amount, uc_status')
        .eq('project_id', projectId);

    const released = funds
        ?.filter(f => f.type === 'Release' || f.type === 'Agency Release' || f.type === 'District Allocation') // Adjust based on exact types used
        .reduce((acc, f) => acc + (f.amount || 0), 0) || 0;

    const utilized = funds
        ?.filter(f => f.type === 'Utilization')
        .reduce((acc, f) => acc + (f.amount || 0), 0) || 0;

    const pendingUCs = funds?.filter(f => f.uc_status === 'Pending').length || 0;

    // Inspections
    const { count: inspectionCount } = await supabase
        .from('inspections')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

    // Documents
    const { count: documentCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

    await supabase
        .from('projects')
        .update({
            progress,
            total_funds_released: released,
            total_funds_utilized: utilized,
            pending_ucs: pendingUCs,
            milestone_count: totalMilestones,
            inspection_count: inspectionCount || 0,
            document_count: documentCount || 0,
            updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
};

// Helper to map DB result to camelCase
const mapProject = (p: any) => ({
    id: p.id,
    projectId: p.project_id,
    title: p.title,
    component: p.component,
    implementingAgencyId: p.implementing_agency_id,
    executingAgencyId: p.executing_agency_id,
    state: p.state,
    district: p.district,
    startDate: p.start_date,
    endDate: p.end_date,
    status: p.status,
    progress: p.progress,
    estimatedCost: p.estimated_cost,
    location: {
        lat: p.location_lat,
        lng: p.location_lng
    },
    tags: p.tags,
    description: p.description,
    totalFundsReleased: p.total_funds_released,
    totalFundsUtilized: p.total_funds_utilized,
    pendingUCs: p.pending_ucs,
    milestoneCount: p.milestone_count,
    inspectionCount: p.inspection_count,
    documentCount: p.document_count,
    createdAt: p.created_at,
    updatedAt: p.updated_at
});
