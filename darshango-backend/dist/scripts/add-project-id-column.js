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
const supabase_1 = require("../config/supabase");
/**
 * Alternative migration approach using raw SQL query
 */
function addProjectIdColumn() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Attempting to add project_id column...');
        try {
            // Try to insert a test record to check if column exists
            const testQuery = yield supabase_1.supabase
                .from('projects')
                .select('project_id')
                .limit(1);
            if (testQuery.error) {
                console.error('Column does not exist. Error:', testQuery.error.message);
                console.log('\n⚠️  MANUAL ACTION REQUIRED ⚠️');
                console.log('Please run this SQL in your Supabase SQL Editor:');
                console.log('================================================');
                console.log('ALTER TABLE projects ADD COLUMN project_id VARCHAR(255);');
                console.log('CREATE INDEX idx_projects_project_id ON projects(project_id);');
                console.log('================================================\n');
                console.log('Steps:');
                console.log('1. Go to https://supabase.com');
                console.log('2. Open your project');
                console.log('3. Click "SQL Editor" in the sidebar');
                console.log('4. Paste the SQL above');
                console.log('5. Click "Run"');
            }
            else {
                console.log('✓ Column project_id already exists!');
            }
        }
        catch (error) {
            console.error('Error:', error.message);
        }
        process.exit(0);
    });
}
addProjectIdColumn();
