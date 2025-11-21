import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import agencyRoutes from './modules/agencies/agency.routes';
import projectRoutes from './modules/projects/project.routes';
import milestoneRoutes from './modules/milestones/milestone.routes';
import fundRoutes from './modules/funds/fund.routes';
import inspectionRoutes from './modules/inspections/inspection.routes';
import documentRoutes from './modules/documents/document.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/agencies', agencyRoutes);
router.use('/projects', projectRoutes);

// Nested routes for project sub-resources
router.use('/projects/:id/milestones', milestoneRoutes);
router.use('/projects/:id/funds', fundRoutes);
router.use('/projects/:id/inspections', inspectionRoutes);
router.use('/projects/:id/documents', documentRoutes);

// Direct access routes if needed (e.g., for admin listing all milestones)
// router.use('/milestones', milestoneRoutes);

export default router;
