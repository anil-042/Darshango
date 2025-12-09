import { supabase } from '../config/supabase';
import { createGrievance } from '../modules/grievances/grievance.service';

async function debugSubmission() {
    console.log('--- Starting Debug Submission ---');

    // 1. Fetch a real user
    const { data: users, error: userError } = await supabase.from('users').select('id').limit(1);
    if (userError || !users || users.length === 0) {
        console.error('❌ Could not fetch any user to use as creator:', userError);
        return;
    }
    const userId = users[0].id;
    console.log('Using User ID:', userId);

    // 2. Check Schema keys
    const { data: schemaCheck, error: schemaError } = await supabase.from('grievances').select('*').limit(1);
    if (schemaError) {
        console.error('❌ Could not fetch grievances table:', schemaError);
    } else if (schemaCheck && schemaCheck.length > 0) {
        console.log('Table Columns:', Object.keys(schemaCheck[0]));
    } else {
        console.log('Table is empty, cannot check columns easily via select *');
    }

    const testPayload = {
        projectId: null,
        isGeneral: true,
        type: null,
        category: 'System Issue',
        level: 'State → Central',
        component: undefined,
        district: 'Debug District',
        source: 'Public',
        priority: 'Normal',
        description: 'Debug submission test ' + new Date().toISOString(),
        createdBy: userId
    };

    try {
        console.log('Payload:', JSON.stringify(testPayload, null, 2));
        const result = await createGrievance(testPayload);
        console.log('✅ Success:', result);
    } catch (error: any) {
        console.error('❌ Failed:', error.message);
        if (error.details) console.error('Details:', error.details);
        if (error.hint) console.error('Hint:', error.hint);
    }

    process.exit(0);
}

debugSubmission();


