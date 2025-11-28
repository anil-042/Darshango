import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import agencyRoutes from './modules/agencies/agency.routes';
import projectRoutes from './modules/projects/project.routes';
import milestoneRoutes from './modules/milestones/milestone.routes';
import fundRoutes from './modules/funds/fund.routes';
import inspectionRoutes from './modules/inspections/inspection.routes';
import documentRoutes from './modules/documents/document.routes';
import alertRoutes from './modules/alerts/alert.routes';
import reportRoutes from './modules/reports/report.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import meetingRoutes from './modules/meetings/meeting.routes';
import messageRoutes from './modules/messages/message.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/agencies', agencyRoutes);
router.use('/projects', projectRoutes);
router.use('/alerts', alertRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/funds', fundRoutes); // Global funds route
router.use('/inspections', inspectionRoutes); // Global inspections route
router.use('/documents', documentRoutes); // Global documents route
router.use('/milestones', milestoneRoutes); // Global milestones route
router.use('/meetings', meetingRoutes);

// Nested routes for project sub-resources
router.use('/projects/:id/milestones', milestoneRoutes);
router.use('/projects/:id/funds', fundRoutes);
router.use('/projects/:id/inspections', inspectionRoutes);
router.use('/projects/:id/documents', documentRoutes);
router.use('/projects/:projectId/messages', messageRoutes);

export default router;
