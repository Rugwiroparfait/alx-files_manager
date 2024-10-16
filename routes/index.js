import { Router } from 'express';
import FilesController from '../controllers/FilesController';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
const router = Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.post('/files', FilesController.postupload);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);

export default router;

