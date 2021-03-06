import express from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import IsAdminMiddleware from '../middlewares/IsAdminMiddleware';
import CreateTripMiddleware from '../middlewares/CreateTripMiddleware';
import CancelTripMiddleware from '../middlewares/CancelTripMiddleware';
import TripController from '../controllers/TripController';
import ValidationErrors from '../middlewares/ValidationErrors';
import SearchTripMiddleware from '../middlewares/SearchTripMiddleware';

const router = express.Router();

router.get('/trips', AuthMiddleware, TripController.view);
router.post('/trips', AuthMiddleware, IsAdminMiddleware, CreateTripMiddleware, ValidationErrors, TripController.create);
router.patch('/trips/:id', AuthMiddleware, IsAdminMiddleware, CancelTripMiddleware, ValidationErrors, TripController.cancel);
router.get('/trips/search', AuthMiddleware, SearchTripMiddleware, TripController.search);

export default router;
