import { supabase } from '../../config/supabase';
import { recalculateProjectStats } from '../projects/project.service';

export const uploadDocument = async (projectId: string, documentData: any) => {
    const dbDocument = {
        project_id: projectId,
        title: documentData.title,
        type: documentData.type,
        uploaded_by: documentData.uploadedBy,
        upload_date: new Date().toISOString(),
        size: documentData.size,
        url: documentData.url,
        category: documentData.category,
        status: documentData.status || 'Pending',
        agency_id: documentData.agencyId,
        version: documentData.version || 1,
        linked_entity_id: documentData.linkedEntityId,
        linked_entity_type: documentData.linkedEntityType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('documents')
        .insert([dbDocument])
        .select()
        .single();

    if (error) throw new Error(error.message);

    await recalculateProjectStats(projectId);

    return mapDocument(data);
};

export const getDocuments = async (projectId: string) => {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .order('upload_date', { ascending: false });

    if (error) {
        console.error(`[DocumentService] Error fetching documents for project ${projectId}:`, error);
        throw new Error(error.message);
    }
    return data.map(mapDocument);
};

export const getAllDocuments = async () => {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('upload_date', { ascending: false });

    if (error) {
        console.error("[DocumentService] Error fetching all documents:", error);
        throw new Error(error.message);
    }
    console.log(`[DocumentService] Found ${data.length} documents in DB`);
    return data.map(mapDocument);
};

export const deleteDocument = async (projectId: string, documentId: string) => {
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

    if (error) throw new Error(error.message);

    await recalculateProjectStats(projectId);
    return true;
};

const mapDocument = (d: any) => ({
    id: d.id,
    projectId: d.project_id,
    title: d.title,
    type: d.type,
    uploadedBy: d.uploaded_by,
    uploadedAt: d.upload_date, // Mapping upload_date to uploadedAt as per original service return
    size: d.size,
    url: d.url,
    category: d.category,
    status: d.status,
    agencyId: d.agency_id,
    version: d.version,
    linkedEntityId: d.linked_entity_id,
    linkedEntityType: d.linked_entity_type,
    createdAt: d.created_at,
    updatedAt: d.updated_at
});
