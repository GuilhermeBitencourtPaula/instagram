import { Router } from 'express';
import { createSearch, getUserSearches, deleteSearch, processSearch, getStats, toggleFavorite } from '../controllers/search.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { cacheMiddleware } from '../middlewares/cache.middleware';

const router = Router();

// All search routes require authentication
router.use(authenticateToken);

// @route POST /api/searches
router.post('/', createSearch);

// @route POST /api/searches/:id/process
router.post('/:id/process', processSearch);

// @route GET /api/searches
router.get('/', getUserSearches);

// @route GET /api/searches/stats
router.get('/stats', cacheMiddleware(600), getStats);

// @route DELETE /api/searches/:id
router.delete('/:id', deleteSearch);

// @route PATCH /api/searches/:id/favorite
router.patch('/:id/favorite', toggleFavorite);

export default router;
