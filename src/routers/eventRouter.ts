import { Router } from 'express';
import EventController from '../controllers/eventController';

const eventRouter = Router();

eventRouter.post('/', EventController.createEvent);
eventRouter.get('/point/list', EventController.getAllPoints);
eventRouter.get('/point/user/:userId', EventController.getPointByUser);
eventRouter.post('/scenario', EventController.scenario);

export default eventRouter;
