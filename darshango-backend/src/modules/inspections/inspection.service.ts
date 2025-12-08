import { supabase } from '../../config/supabase';
import { createAutoAlert } from '../alerts/alert.service';
import { recalculateProjectStats } from '../projects/project.service';
import { createNotification } from '../notifications/notification.service';

export const createInspection = async (projectId: string, inspectionData: any) => {
    console.log('Creating inspection for project:', projectId, 'Data:', inspectionData);

    // Fetch Project Details for Title and Location
    const { data: project } = await supabase
        .from('projects')
        .select('title, district, state')
        .eq('project_id', projectId) // Assuming projectId passes usage 'project_id' from DB, but let's check input
        // Wait, projectId arg is usually the UUID. Let's check query.
        // Actually, let's just query by the passed ID safely.
        .eq('project_id', projectId)
        .maybeSingle();

    // Fallback if project search fails or title missing
    let projectTitle = 'Project';
    let projectLocation = '';

    if (project) {
        if (project.title) {
            projectTitle = project.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        }
        if (project.district || project.state) {
            projectLocation = [project.district, project.state].filter(Boolean).join(', ');
        }
    } else {
        // Try querying by 'id' (UUID) if 'project_id' (string ID) failed
        const { data: projectByUuid } = await supabase
            .from('projects')
            .select('title, district, state')
            .eq('id', projectId)
            .maybeSingle();
        if (projectByUuid) {
            if (projectByUuid.title) {
                projectTitle = projectByUuid.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
            }
            if (projectByUuid.district || projectByUuid.state) {
                projectLocation = [projectByUuid.district, projectByUuid.state].filter(Boolean).join(', ');
            }
        }
    }

    // Get Count of existing inspections for this project
    const { count } = await supabase
        .from('inspections')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

    const nextSequence = (count || 0) + 1;
    const readableId = `${projectTitle}_inspection-${nextSequence}`;

    const dbInspection = {
        project_id: projectId,
        inspector_name: inspectionData.inspectorName,
        date: inspectionData.date,
        status: inspectionData.status,
        rating: inspectionData.rating,
        comments: inspectionData.comments,
        findings: inspectionData.findings,
        checklist: inspectionData.checklist,
        geo_location_lat: inspectionData.geoLocation?.lat,
        geo_location_lng: inspectionData.geoLocation?.lng,
        images: inspectionData.images,
        inspection_id: readableId, // Store formatted ID
        location: projectLocation, // Auto-populated location
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('inspections')
        .insert([dbInspection])
        .select()
        .single();

    if (error) {
        console.error("!!! SUPABASE INSERT ERROR !!!");
        console.dir(error, { depth: null });
        throw new Error(JSON.stringify(error));
    }

    try {
        await recalculateProjectStats(projectId);
    } catch (statsError) {
        console.error("Failed to recalculate project stats", statsError);
    }

    // Notify System (Non-blocking)
    try {
        await createNotification(
            'New Inspection Report',
            `Inspection submitted for Project: ${projectId} by ${inspectionData.inspectorName}`,
            'Info',
            `/projects/${projectId}`
        );
    } catch (notifError) {
        console.error('Failed to send inspection notification:', notifError);
    }

    if (inspectionData.rating === 'Needs Attention' || inspectionData.rating === 'Critical' || inspectionData.severity === 'Critical') {
        try {
            await createAutoAlert('Inspection', projectId, `Critical inspection finding: ${inspectionData.findings}`, 'High');
        } catch (alertError) {
            console.error("Failed to create auto alert", alertError);
        }
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
    if (updateData.comments) dbUpdate.comments = updateData.comments;
    if (updateData.findings) dbUpdate.findings = updateData.findings;
    if (updateData.checklist) dbUpdate.checklist = updateData.checklist;
    if (updateData.geoLocation) {
        dbUpdate.geo_location_lat = updateData.geoLocation.lat;
        dbUpdate.geo_location_lng = updateData.geoLocation.lng;
    }
    if (updateData.detailedReview) dbUpdate.review = updateData.detailedReview;
    if (updateData.images) dbUpdate.images = updateData.images;
    if (updateData.location) dbUpdate.location = updateData.location;

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
    comments: i.comments,
    findings: i.findings,
    detailedReview: i.review,
    customId: i.inspection_id, // Map readable ID
    location: i.location,
    checklist: i.checklist,
    geoLocation: {
        lat: i.geo_location_lat,
        lng: i.geo_location_lng
    },
    images: i.images,
    createdAt: i.created_at,
    updatedAt: i.updated_at
});
