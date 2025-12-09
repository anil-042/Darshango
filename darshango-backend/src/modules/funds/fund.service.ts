import { supabase } from '../../config/supabase';
import { recalculateProjectStats } from '../projects/project.service';
import { createAutoAlert } from '../alerts/alert.service';

export const createFundTransaction = async (projectId: string | undefined, fundData: any) => {
    const dbFund = {
        project_id: projectId || null,
        type: fundData.type,
        from_level: fundData.fromLevel,
        to_level: fundData.toLevel,
        amount: fundData.amount,
        utr_number: fundData.utrNumber,
        date: fundData.date,
        status: fundData.status,
        description: fundData.description,
        proof_file: fundData.proofFile,
        created_by: fundData.createdBy,
        uc_status: fundData.ucStatus || 'Pending',
        state: fundData.state || null,
        district: fundData.district || null,
        agency_id: fundData.agencyId || null,
        component: fundData.component || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('funds')
        .insert([dbFund])
        .select()
        .single();

    if (error) throw new Error(error.message);

    if (projectId) {
        await recalculateProjectStats(projectId);
    }

    return mapFund(data);
};

export const getFundTransactions = async (projectId: string) => {
    const { data, error } = await supabase
        .from('funds')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(mapFund);
};

export const getAllFundTransactions = async () => {
    const { data, error } = await supabase
        .from('funds')
        .select('*')
        .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(mapFund);
};

export const updateFundTransaction = async (projectId: string | undefined, fundId: string, updateData: any) => {
    const dbUpdate: any = {
        updated_at: new Date().toISOString()
    };

    if (updateData.type) dbUpdate.type = updateData.type;
    if (updateData.fromLevel) dbUpdate.from_level = updateData.fromLevel;
    if (updateData.toLevel) dbUpdate.to_level = updateData.toLevel;
    if (updateData.amount) dbUpdate.amount = updateData.amount;
    if (updateData.utrNumber) dbUpdate.utr_number = updateData.utrNumber;
    if (updateData.date) dbUpdate.date = updateData.date;
    if (updateData.status) dbUpdate.status = updateData.status;
    if (updateData.description) dbUpdate.description = updateData.description;
    if (updateData.proofFile) dbUpdate.proof_file = updateData.proofFile;
    if (updateData.ucStatus) dbUpdate.uc_status = updateData.ucStatus;
    if (updateData.state) dbUpdate.state = updateData.state;
    if (updateData.district) dbUpdate.district = updateData.district;
    if (updateData.agencyId) dbUpdate.agency_id = updateData.agencyId;
    if (updateData.component) dbUpdate.component = updateData.component;

    const { data, error } = await supabase
        .from('funds')
        .update(dbUpdate)
        .eq('id', fundId)
        .select()
        .single();

    if (error) throw new Error(error.message);

    if (projectId) {
        await recalculateProjectStats(projectId);
    }

    return mapFund(data);
};

export const deleteFundTransaction = async (projectId: string | undefined, fundId: string) => {
    const { error } = await supabase
        .from('funds')
        .delete()
        .eq('id', fundId);

    if (error) throw new Error(error.message);

    if (projectId) {
        await recalculateProjectStats(projectId);
    }
    return true;
};

const mapFund = (f: any) => ({
    id: f.id,
    projectId: f.project_id,
    type: f.type,
    fromLevel: f.from_level,
    toLevel: f.to_level,
    amount: f.amount,
    utrNumber: f.utr_number,
    date: f.date,
    status: f.status,
    description: f.description,
    proofFile: f.proof_file,
    createdBy: f.created_by,
    ucStatus: f.uc_status,
    state: f.state,
    district: f.district,
    agencyId: f.agency_id,
    component: f.component,
    createdAt: f.created_at,
    updatedAt: f.updated_at
});
