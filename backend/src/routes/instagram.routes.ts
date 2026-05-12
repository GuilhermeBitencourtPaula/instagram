import { Router } from 'express';
import { getAuthUrl, handleCallback, getStatus, disconnect } from '../controllers/instagram.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// OAuth callback is public but requires code
router.get('/callback', handleCallback);

// Other routes require internal authentication
router.use(authenticateToken);

router.get('/auth-url', getAuthUrl);
router.get('/status', getStatus);
router.post('/disconnect', disconnect);

export default router;
