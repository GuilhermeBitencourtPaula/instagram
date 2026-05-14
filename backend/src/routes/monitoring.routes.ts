import { Router } from 'express';
import { getAlerts, createAlert, updateAlert, deleteAlert } from '../controllers/monitoring.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getAlerts);
router.post('/', createAlert);
router.patch('/:id', updateAlert);
router.delete('/:id', deleteAlert);

router.get('/test', (req, res) => res.json({ message: 'Monitoring routes are working!' }));

export default router;

