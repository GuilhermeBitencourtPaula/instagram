import { Router } from 'express';
import { createSearch, getUserSearches, deleteSearch, processSearch } from '../controllers/search.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All search routes require authentication
router.use(authenticateToken);

// @route POST /api/searches
router.post('/', createSearch);

// @route POST /api/searches/:id/process
router.post('/:id/process', processSearch);

// @route GET /api/searches
router.get('/', getUserSearches);

// @route DELETE /api/searches/:id
router.delete('/:id', deleteSearch);

export default router;
