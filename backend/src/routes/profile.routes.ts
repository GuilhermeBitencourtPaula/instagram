import { Router } from 'express';
import { getProfiles, getProfileDetails } from '../controllers/profile.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { cacheMiddleware } from '../middlewares/cache.middleware';

const router = Router();

router.use(authenticateToken);

// @route GET /api/profiles
router.get('/', cacheMiddleware(300), getProfiles);

// @route GET /api/profiles/:id
router.get('/:id', getProfileDetails);

export default router;
