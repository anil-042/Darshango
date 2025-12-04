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
 * Script to check for delayed projects and create alerts
 * Run this manually or schedule it to run daily
 */
function checkDelayedProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Checking for delayed projects...');
        try {
            // Get all projects that are not completed
            const { data: projects, error: projectsError } = yield supabase_1.supabase
                .from('projects')
                .select('id, project_id, title, end_date, status')
                .neq('status', 'Completed'); // Don't check completed projects
            if (projectsError) {
                console.error('Error fetching projects:', projectsError);
                return;
            }
            if (!projects || projects.length === 0) {
                console.log('No active projects found.');
                return;
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate day comparison
            let delayedCount = 0;
            let alertsCreated = 0;
            for (const project of projects) {
                const endDate = new Date(project.end_date);
                endDate.setHours(0, 0, 0, 0);
                // Check if project is delayed (current date > end date)
                if (endDate < today) {
                    const daysDelayed = Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
                    delayedCount++;
                    console.log(`Project "${project.title}" (${project.project_id || project.id}) is delayed by ${daysDelayed} days`);
                    // Check if alert already exists for this project delay
                    const { data: existingAlerts } = yield supabase_1.supabase
                        .from('alerts')
                        .select('id, description')
                        .eq('project_id', project.id)
                        .eq('type', 'Project Delay')
                        .eq('status', 'Open');
                    // Check if we already have a recent delay alert
                    const hasRecentDelayAlert = existingAlerts && existingAlerts.some((alert) => alert.description.includes('delayed by'));
                    if (!hasRecentDelayAlert) {
                        // Create new alert
                        const { error: alertError } = yield supabase_1.supabase
                            .from('alerts')
                            .insert({
                            project_id: project.id,
                            type: 'Project Delay',
                            priority: daysDelayed > 30 ? 'High' : daysDelayed > 7 ? 'Medium' : 'Low',
                            description: `Project delayed by ${daysDelayed} day${daysDelayed > 1 ? 's' : ''}. End date was ${endDate.toLocaleDateString()}.`,
                            status: 'Open',
                            date: new Date().toISOString()
                        });
                        if (alertError) {
                            console.error(`Error creating alert for project ${project.id}:`, alertError);
                        }
                        else {
                            console.log(`✓ Created alert for project "${project.title}"`);
                            alertsCreated++;
                        }
                    }
                    else {
                        console.log(`  Alert already exists for this project`);
                    }
                    // Update project status to Delayed if not already
                    if (project.status !== 'Delayed') {
                        yield supabase_1.supabase
                            .from('projects')
                            .update({ status: 'Delayed' })
                            .eq('id', project.id);
                        console.log(`  Updated project status to "Delayed"`);
                    }
                }
            }
            console.log('\n=== Summary ===');
            console.log(`Total projects checked: ${projects.length}`);
            console.log(`Delayed projects found: ${delayedCount}`);
            console.log(`New alerts created: ${alertsCreated}`);
        }
        catch (error) {
            console.error('Unexpected error:', error.message);
        }
        process.exit(0);
    });
}
checkDelayedProjects();
