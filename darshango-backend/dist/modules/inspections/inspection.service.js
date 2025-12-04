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
exports.deleteInspection = exports.updateInspection = exports.getAllInspections = exports.getInspectionById = exports.getInspections = exports.createInspection = void 0;
const supabase_1 = require("../../config/supabase");
const alert_service_1 = require("../alerts/alert.service");
const project_service_1 = require("../projects/project.service");
const createInspection = (projectId, inspectionData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
        geo_location_lat: (_a = inspectionData.geoLocation) === null || _a === void 0 ? void 0 : _a.lat,
        geo_location_lng: (_b = inspectionData.geoLocation) === null || _b === void 0 ? void 0 : _b.lng,
        images: inspectionData.images,
        inspection_id: inspectionData.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    const { data, error } = yield supabase_1.supabase
        .from('inspections')
        .insert([dbInspection])
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    if (inspectionData.rating === 'Needs Attention' || inspectionData.rating === 'Critical' || inspectionData.severity === 'Critical') {
        yield (0, alert_service_1.createAutoAlert)('Inspection', projectId, `Critical inspection finding: ${inspectionData.findings}`, 'High');
    }
    console.log('Inspection created with ID:', data.id);
    return mapInspection(data);
});
exports.createInspection = createInspection;
const getInspections = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('inspections')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data.map(mapInspection);
});
exports.getInspections = getInspections;
const getInspectionById = (inspectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('inspections')
        .select('*')
        .eq('id', inspectionId)
        .single();
    if (error)
        return null;
    return mapInspection(data);
});
exports.getInspectionById = getInspectionById;
const getAllInspections = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('inspections')
        .select('*')
        .order('date', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data.map(mapInspection);
});
exports.getAllInspections = getAllInspections;
const updateInspection = (projectId, inspectionId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const dbUpdate = {
        updated_at: new Date().toISOString()
    };
    if (updateData.inspectorName)
        dbUpdate.inspector_name = updateData.inspectorName;
    if (updateData.date)
        dbUpdate.date = updateData.date;
    if (updateData.status)
        dbUpdate.status = updateData.status;
    if (updateData.rating)
        dbUpdate.rating = updateData.rating;
    if (updateData.severity)
        dbUpdate.severity = updateData.severity;
    if (updateData.comments)
        dbUpdate.comments = updateData.comments;
    if (updateData.findings)
        dbUpdate.findings = updateData.findings;
    if (updateData.checklist)
        dbUpdate.checklist = updateData.checklist;
    if (updateData.geoLocation) {
        dbUpdate.geo_location_lat = updateData.geoLocation.lat;
        dbUpdate.geo_location_lng = updateData.geoLocation.lng;
    }
    if (updateData.detailedReview)
        dbUpdate.review = updateData.detailedReview;
    if (updateData.customId)
        dbUpdate.inspection_id = updateData.customId;
    if (updateData.images)
        dbUpdate.images = updateData.images;
    const { data, error } = yield supabase_1.supabase
        .from('inspections')
        .update(dbUpdate)
        .eq('id', inspectionId)
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    if (updateData.rating === 'Needs Attention' || updateData.rating === 'Critical') {
        yield (0, alert_service_1.createAutoAlert)('Inspection', projectId, `Critical inspection finding updated: ${updateData.findings}`, 'High');
    }
    return mapInspection(data);
});
exports.updateInspection = updateInspection;
const deleteInspection = (projectId, inspectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = yield supabase_1.supabase
        .from('inspections')
        .delete()
        .eq('id', inspectionId);
    if (error)
        throw new Error(error.message);
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return true;
});
exports.deleteInspection = deleteInspection;
const mapInspection = (i) => ({
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
