import { supabase } from '../../config/supabase';

export const createAgency = async (agencyData: any) => {
    const dbAgency = {
        name: agencyData.name,
        code: agencyData.code,
        category: agencyData.category,
        role_type: agencyData.roleType,
        state: agencyData.state,
        district: agencyData.district,
        village: agencyData.village,
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

    const { data, error } = await supabase
        .from('agencies')
        .insert([dbAgency])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapAgency(data);
};

export const getAllAgencies = async (filters: any = {}) => {
    let query = supabase.from('agencies').select('*');

    // Global Search Filter
    if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%,village.ilike.%${filters.search}%`);
    }

    const { data: agencies, error: agencyError } = await query.order('created_at', { ascending: false });
    if (agencyError) throw new Error(agencyError.message);

    // Fetch active projects counts
    // Note: status 'In Progress' is considered active. Adjust if needed.
    const { data: activeProjects, error: projectError } = await supabase
        .from('projects')
        .select('implementing_agency_id, executing_agency_id')
        .eq('status', 'In Progress');

    if (projectError) {
        console.error("Failed to fetch active projects count:", projectError);
        // Fallback to static column if this fails, or just distinct 0
    }

    // Aggregate counts
    const agencyCounts: Record<string, number> = {};
    if (activeProjects) {
        activeProjects.forEach((p: any) => {
            // Count as implementing agency
            if (p.implementing_agency_id) {
                agencyCounts[p.implementing_agency_id] = (agencyCounts[p.implementing_agency_id] || 0) + 1;
            }
            // Count as executing agency
            if (p.executing_agency_id) {
                // Determine if we should count it separately or if it's the same project
                // For 'Active Projects' count, does the agency handle this project? Yes.
                // We just need to handle if the same agency is BOTH implementing AND executing the SAME project
                // In that case, should it count as 1 or 2? Usually 1 project = 1 count.
                // But simplified: checking if ID differs avoids double counting if logic splits, 
                // but actually if an agency is both, it's just one project for them.

                // However, simpler logic:
                if (p.executing_agency_id !== p.implementing_agency_id) {
                    agencyCounts[p.executing_agency_id] = (agencyCounts[p.executing_agency_id] || 0) + 1;
                }
            }
        });
    }

    // Merge counts
    const mergedData = agencies.map((agency: any) => ({
        ...agency,
        active_projects: agencyCounts[agency.id] || 0 // Usage of dynamic count
    }));

    return mergedData.map(mapAgency);
};

export const updateAgency = async (id: string, updateData: any) => {
    const dbUpdate: any = {
        last_updated: new Date().toISOString()
    };

    // Map fields
    if (updateData.name) dbUpdate.name = updateData.name;
    if (updateData.code) dbUpdate.code = updateData.code;
    if (updateData.category) dbUpdate.category = updateData.category;
    if (updateData.roleType) dbUpdate.role_type = updateData.roleType;
    if (updateData.state) dbUpdate.state = updateData.state;
    if (updateData.district) dbUpdate.district = updateData.district;
    if (updateData.village) dbUpdate.village = updateData.village;
    if (updateData.address) dbUpdate.address = updateData.address;
    if (updateData.contactPerson) dbUpdate.contact_person = updateData.contactPerson;
    if (updateData.designation) dbUpdate.designation = updateData.designation;
    if (updateData.phone) dbUpdate.phone = updateData.phone;
    if (updateData.email) dbUpdate.email = updateData.email;
    if (updateData.registrationNumber) dbUpdate.registration_number = updateData.registrationNumber;
    if (updateData.gstin) dbUpdate.gstin = updateData.gstin;
    if (updateData.website) dbUpdate.website = updateData.website;
    if (updateData.remarks) dbUpdate.remarks = updateData.remarks;
    if (updateData.components) dbUpdate.components = updateData.components;
    if (updateData.activeProjects !== undefined) dbUpdate.active_projects = updateData.activeProjects;
    if (updateData.performance !== undefined) dbUpdate.performance = updateData.performance;

    const { data, error } = await supabase
        .from('agencies')
        .update(dbUpdate)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapAgency(data);
};

export const deleteAgency = async (id: string) => {
    const { error } = await supabase
        .from('agencies')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
};

const mapAgency = (a: any) => ({
    id: a.id,
    name: a.name,
    code: a.code,
    category: a.category,
    roleType: a.role_type,
    state: a.state,
    district: a.district,
    village: a.village,
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
