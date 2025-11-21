import { Router } from 'express';
import * as documentController from './document.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorize } from '../../middleware/roleMiddleware';
import upload from '../../storage/upload';

const router = Router({ mergeParams: true });

router.use(protect);

router.post('/', authorize('Admin', 'StateNodalOfficer', 'AgencyAdmin'), upload.single('file'), documentController.uploadDocument);
router.get('/', documentController.getDocuments);
router.delete('/:docId', authorize('Admin'), documentController.deleteDocument);

export default router;
