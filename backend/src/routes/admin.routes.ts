import { Router } from 'express';
import { getAdminStats, getAllUsers, getSystemLogs } from '../controllers/admin.controller';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

// Proteção global: Precisa estar logado
router.use(authenticateToken);

// Opcional: Apenas usuários com role 'ADMIN' podem acessar
// Se você não definiu roles ainda, podemos usar apenas a autenticação por enquanto
// router.use(authorizeRole('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/logs', getSystemLogs);

export default router;
