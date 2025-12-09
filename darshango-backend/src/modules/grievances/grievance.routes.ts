import { Router } from 'express';
import * as GrievanceController from './grievance.controller';

const router = Router();

router.post('/', GrievanceController.createGrievance);
router.get('/', GrievanceController.getAllGrievances);
router.get('/:id', GrievanceController.getGrievanceById);
router.patch('/:id', GrievanceController.updateGrievance);
router.delete('/:id', GrievanceController.deleteGrievance);

export default router;
