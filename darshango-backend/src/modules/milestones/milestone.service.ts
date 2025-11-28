import { supabase } from '../../config/supabase';
import { recalculateProjectStats } from '../projects/project.service';

export const createMilestone = async (projectId: string, milestoneData: any) => {
    const dbMilestone = {
        project_id: projectId,
        title: milestoneData.title,
        status: milestoneData.status || 'Pending',
        owner: milestoneData.owner,
        start_date: milestoneData.startDate,
        due_date: milestoneData.dueDate,
        completion_date: milestoneData.completionDate,
        progress: milestoneData.progress || 0,
        remarks: milestoneData.remarks,
        order_index: milestoneData.orderIndex || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('milestones')
        .insert([dbMilestone])
        .select()
        .single();

    if (error) throw new Error(error.message);

    await recalculateProjectStats(projectId);

    return mapMilestone(data);
};

export const getMilestones = async (projectId: string) => {
    const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(mapMilestone);
};

export const getAllMilestones = async () => {
    const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(mapMilestone);
};

export const updateMilestone = async (projectId: string, milestoneId: string, updateData: any) => {
    const dbUpdate: any = {
        updated_at: new Date().toISOString()
    };

    if (updateData.title) dbUpdate.title = updateData.title;
    if (updateData.status) dbUpdate.status = updateData.status;
    if (updateData.owner) dbUpdate.owner = updateData.owner;
    if (updateData.startDate) dbUpdate.start_date = updateData.startDate;
    if (updateData.dueDate) dbUpdate.due_date = updateData.dueDate;
    if (updateData.completionDate) dbUpdate.completion_date = updateData.completionDate;
    if (updateData.progress !== undefined) dbUpdate.progress = updateData.progress;
    if (updateData.remarks) dbUpdate.remarks = updateData.remarks;
    if (updateData.orderIndex !== undefined) dbUpdate.order_index = updateData.orderIndex;

    const { data, error } = await supabase
        .from('milestones')
        .update(dbUpdate)
        .eq('id', milestoneId)
        .select()
        .single();

    if (error) throw new Error(error.message);

    await recalculateProjectStats(projectId);

    return mapMilestone(data);
};

export const deleteMilestone = async (projectId: string, milestoneId: string) => {
    const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', milestoneId);

    if (error) throw new Error(error.message);

    await recalculateProjectStats(projectId);
    return true;
};

const mapMilestone = (m: any) => ({
    id: m.id,
    projectId: m.project_id,
    title: m.title,
    status: m.status,
    owner: m.owner,
    startDate: m.start_date,
    dueDate: m.due_date,
    completionDate: m.completion_date,
    progress: m.progress,
    remarks: m.remarks,
    orderIndex: m.order_index,
    createdAt: m.created_at,
    updatedAt: m.updated_at
});
