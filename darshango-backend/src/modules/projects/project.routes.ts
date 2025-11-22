import { Router } from 'express';
import * as projectController from './project.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorize } from '../../middleware/roleMiddleware';
import { validate, projectSchema } from '../../utils/validators';

const router = Router();

router.use(protect);

router.post('/', authorize('Admin', 'StateNodalOfficer'), validate(projectSchema), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.put('/:id', authorize('Admin', 'StateNodalOfficer'), projectController.updateProject);
router.delete('/:id', authorize('Admin'), projectController.deleteProject);

export default router;
