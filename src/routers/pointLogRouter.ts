import { Router } from 'express';
import PointLogController from '../controllers/pointLogController';

const pointLogsRouter = Router();

pointLogsRouter.post('/', PointLogController.createPoingLog);
