import { Router } from 'express';
import healthRoutes from './health.routes';
import codeOnDemandRoutes from './code-on-demand.routes';
import userRoutes from './v1/user.routes';
import postRoutes from './v1/post.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/code-on-demand', codeOnDemandRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/posts', postRoutes);

export default router;
