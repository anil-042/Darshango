import { supabase } from '../config/supabase';
import * as fs from 'fs';

async function checkColumns() {
    console.log('Checking columns...');
    const { data, error } = await supabase.from('grievances').select('*').limit(1);

    if (error) {
        fs.writeFileSync('schema_check.json', JSON.stringify({ error }, null, 2));
    } else if (data && data.length > 0) {
        fs.writeFileSync('schema_check.json', JSON.stringify({ columns: Object.keys(data[0]) }, null, 2));
    } else {
        // Try to insert a dummy to see error if columns are missing
        // or just return empty
        fs.writeFileSync('schema_check.json', JSON.stringify({ message: 'Table empty' }, null, 2));
    }
}

checkColumns();
