import { supabase } from '../../config/supabase';

export const generateProjectReport = async (filters: any) => {
    let query = supabase.from('projects').select('*');

    if (filters.state) query = query.eq('state', filters.state);
    if (filters.district) query = query.eq('district', filters.district);
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data.map((p: any) => ({
        id: p.id,
        title: p.title,
        component: p.component,
        agency: p.implementing_agency_id,
        status: p.status,
        progress: p.progress,
        fundsReleased: p.total_funds_released,
        fundsUtilized: p.total_funds_utilized
    }));
};

export const generateFundReport = async () => {
    const { data, error } = await supabase
        .from('funds')
        .select('*')
        .order('date', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((f: any) => ({
        id: f.id,
        projectId: f.project_id,
        type: f.type,
        amount: f.amount,
        date: f.date,
        status: f.status,
        ucStatus: f.uc_status
    }));
};

export const generateUCReport = async () => {
    const { data, error } = await supabase
        .from('projects')
        .select('id, title, pending_ucs')
        .gt('pending_ucs', 0);

    if (error) throw new Error(error.message);

    return data.map((p: any) => ({
        projectId: p.id,
        projectTitle: p.title,
        pendingUCs: p.pending_ucs,
        // lastUCSubmitted: p.last_uc_submitted // Field not in schema yet, omitting or assuming it might be added later
    }));
};
