import express from 'express';

import { index, detail, create, store } from '../app/controllers/PostController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/create', isAuthenticated, create);
router.post('/store', isAuthenticated, store);
router.get('/:slug', detail);
router.get('/', index);

export default router;
