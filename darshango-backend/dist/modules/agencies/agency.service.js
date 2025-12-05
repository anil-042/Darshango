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
exports.deleteAgency = exports.updateAgency = exports.getAllAgencies = exports.createAgency = void 0;
const supabase_1 = require("../../config/supabase");
const createAgency = (agencyData) => __awaiter(void 0, void 0, void 0, function* () {
    const dbAgency = {
        name: agencyData.name,
        code: agencyData.code,
        category: agencyData.category,
        role_type: agencyData.roleType,
        state: agencyData.state,
        district: agencyData.district,
        address: agencyData.address,
        contact_person: agencyData.contactPerson,
        designation: agencyData.designation,
        phone: agencyData.phone,
        email: agencyData.email,
        registration_number: agencyData.registrationNumber,
        gstin: agencyData.gstin,
        website: agencyData.website,
        remarks: agencyData.remarks,
        components: agencyData.components,
        active_projects: agencyData.activeProjects || 0,
        performance: agencyData.performance || 0,
        last_updated: new Date().toISOString(),
        created_at: new Date().toISOString()
    };
    const { data, error } = yield supabase_1.supabase
        .from('agencies')
        .insert([dbAgency])
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    return mapAgency(data);
});
exports.createAgency = createAgency;
const getAllAgencies = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    let query = supabase_1.supabase.from('agencies').select('*');
    // Global Search Filter
    if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
    }
    const { data, error } = yield query.order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data.map(mapAgency);
});
exports.getAllAgencies = getAllAgencies;
const updateAgency = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const dbUpdate = {
        last_updated: new Date().toISOString()
    };
    // Map fields
    if (updateData.name)
        dbUpdate.name = updateData.name;
    if (updateData.code)
        dbUpdate.code = updateData.code;
    if (updateData.category)
        dbUpdate.category = updateData.category;
    if (updateData.roleType)
        dbUpdate.role_type = updateData.roleType;
    if (updateData.state)
        dbUpdate.state = updateData.state;
    if (updateData.district)
        dbUpdate.district = updateData.district;
    if (updateData.address)
        dbUpdate.address = updateData.address;
    if (updateData.contactPerson)
        dbUpdate.contact_person = updateData.contactPerson;
    if (updateData.designation)
        dbUpdate.designation = updateData.designation;
    if (updateData.phone)
        dbUpdate.phone = updateData.phone;
    if (updateData.email)
        dbUpdate.email = updateData.email;
    if (updateData.registrationNumber)
        dbUpdate.registration_number = updateData.registrationNumber;
    if (updateData.gstin)
        dbUpdate.gstin = updateData.gstin;
    if (updateData.website)
        dbUpdate.website = updateData.website;
    if (updateData.remarks)
        dbUpdate.remarks = updateData.remarks;
    if (updateData.components)
        dbUpdate.components = updateData.components;
    if (updateData.activeProjects !== undefined)
        dbUpdate.active_projects = updateData.activeProjects;
    if (updateData.performance !== undefined)
        dbUpdate.performance = updateData.performance;
    const { data, error } = yield supabase_1.supabase
        .from('agencies')
        .update(dbUpdate)
        .eq('id', id)
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    return mapAgency(data);
});
exports.updateAgency = updateAgency;
const deleteAgency = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = yield supabase_1.supabase
        .from('agencies')
        .delete()
        .eq('id', id);
    if (error)
        throw new Error(error.message);
    return true;
});
exports.deleteAgency = deleteAgency;
const mapAgency = (a) => ({
    id: a.id,
    name: a.name,
    code: a.code,
    category: a.category,
    roleType: a.role_type,
    state: a.state,
    district: a.district,
    address: a.address,
    contactPerson: a.contact_person,
    designation: a.designation,
    phone: a.phone,
    email: a.email,
    registrationNumber: a.registration_number,
    gstin: a.gstin,
    website: a.website,
    remarks: a.remarks,
    components: a.components,
    activeProjects: a.active_projects,
    performance: a.performance,
    lastUpdated: a.last_updated,
    createdAt: a.created_at
});
