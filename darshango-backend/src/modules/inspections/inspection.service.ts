import { supabase } from '../../config/supabase';
import { createAutoAlert } from '../alerts/alert.service';
import { recalculateProjectStats } from '../projects/project.service';

export const createInspection = async (projectId: string, inspectionData: any) => {
    console.log('Creating inspection for project:', projectId, 'Data:', inspectionData);

    const dbInspection = {
        project_id: projectId,
        inspector_name: inspectionData.inspectorName,
        date: inspectionData.date,
        status: inspectionData.status,
        rating: inspectionData.rating,
        severity: inspectionData.severity,
        comments: inspectionData.comments,
        findings: inspectionData.findings,
        checklist: inspectionData.checklist, // JSONB
        geo_location_lat: inspectionData.geoLocation?.lat,
        geo_location_lng: inspectionData.geoLocation?.lng,
        images: inspectionData.images,
        inspection_id: inspectionData.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('inspections')
        .insert([dbInspection])
        .select()
        .single();

    if (error) throw new Error(error.message);

    await recalculateProjectStats(projectId);

    if (inspectionData.rating === 'Needs Attention' || inspectionData.rating === 'Critical' || inspectionData.severity === 'Critical') {
        await createAutoAlert('Inspection', projectId, `Critical inspection finding: ${inspectionData.findings}`, 'High');
    }

    console.log('Inspection created with ID:', data.id);
    return mapInspection(data);
};

export const getInspections = async (projectId: string) => {
    const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(mapInspection);
};

export const getInspectionById = async (inspectionId: string) => {
    const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('id', inspectionId)
        .single();

    if (error) return null;
    return mapInspection(data);
};

export const getAllInspections = async () => {
    const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(mapInspection);
};

export const updateInspection = async (projectId: string, inspectionId: string, updateData: any) => {
    const dbUpdate: any = {
        updated_at: new Date().toISOString()
    };

    if (updateData.inspectorName) dbUpdate.inspector_name = updateData.inspectorName;
    if (updateData.date) dbUpdate.date = updateData.date;
    if (updateData.status) dbUpdate.status = updateData.status;
    if (updateData.rating) dbUpdate.rating = updateData.rating;
    if (updateData.severity) dbUpdate.severity = updateData.severity;
    if (updateData.comments) dbUpdate.comments = updateData.comments;
    if (updateData.findings) dbUpdate.findings = updateData.findings;
    if (updateData.checklist) dbUpdate.checklist = updateData.checklist;
    if (updateData.geoLocation) {
        dbUpdate.geo_location_lat = updateData.geoLocation.lat;
        dbUpdate.geo_location_lng = updateData.geoLocation.lng;
    }
    if (updateData.detailedReview) dbUpdate.review = updateData.detailedReview;
    if (updateData.customId) dbUpdate.inspection_id = updateData.customId;
    if (updateData.images) dbUpdate.images = updateData.images;

    const { data, error } = await supabase
        .from('inspections')
        .update(dbUpdate)
        .eq('id', inspectionId)
        .select()
        .single();

    if (error) throw new Error(error.message);

    await recalculateProjectStats(projectId);

    if (updateData.rating === 'Needs Attention' || updateData.rating === 'Critical') {
        await createAutoAlert('Inspection', projectId, `Critical inspection finding updated: ${updateData.findings}`, 'High');
    }

    return mapInspection(data);
};

export const deleteInspection = async (projectId: string, inspectionId: string) => {
    const { error } = await supabase
        .from('inspections')
        .delete()
        .eq('id', inspectionId);

    if (error) throw new Error(error.message);

    await recalculateProjectStats(projectId);
    return true;
};

const mapInspection = (i: any) => ({
    id: i.id,
    projectId: i.project_id,
    inspectorName: i.inspector_name,
    date: i.date,
    status: i.status,
    rating: i.rating,
    severity: i.severity,
    comments: i.comments,
    findings: i.findings,
    detailedReview: i.review,
    customId: i.inspection_id,
    checklist: i.checklist,
    geoLocation: {
        lat: i.geo_location_lat,
        lng: i.geo_location_lng
    },
    images: i.images,
    createdAt: i.created_at,
    updatedAt: i.updated_at
});
