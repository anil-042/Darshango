"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.getAllDocuments = exports.getDocuments = exports.uploadDocument = void 0;
const supabase_1 = require("../../config/supabase");
const project_service_1 = require("../projects/project.service");
const uploadDocument = (projectId, documentData) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { data, error } = yield supabase_1.supabase
        .from('documents')
        .insert([dbDocument])
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return mapDocument(data);
});
exports.uploadDocument = uploadDocument;
const getDocuments = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .order('upload_date', { ascending: false });
    if (error) {
        console.error(`[DocumentService] Error fetching documents for project ${projectId}:`, error);
        throw new Error(error.message);
    }
    return data.map(mapDocument);
});
exports.getDocuments = getDocuments;
const getAllDocuments = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('documents')
        .select('*')
        .order('upload_date', { ascending: false });
    if (error) {
        console.error("[DocumentService] Error fetching all documents:", error);
        throw new Error(error.message);
    }
    console.log(`[DocumentService] Found ${data.length} documents in DB`);
    return data.map(mapDocument);
});
exports.getAllDocuments = getAllDocuments;
const deleteDocument = (projectId, documentId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = yield supabase_1.supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
    if (error)
        throw new Error(error.message);
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return true;
});
exports.deleteDocument = deleteDocument;
const mapDocument = (d) => ({
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
