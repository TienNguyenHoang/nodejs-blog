import express from 'express';

import {
    index,
    detail,
    create,
    store,
    edit,
    update,
    restore,
    destroy,
    force,
} from '../app/controllers/PostController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/create', isAuthenticated, create);
router.post('/store', isAuthenticated, store);
router.get('/:id/edit', isAuthenticated, edit);
router.put('/:id', isAuthenticated, update);
router.patch('/:id/restore', isAuthenticated, restore);
router.delete('/:id', isAuthenticated, destroy);
router.delete('/:id/force', isAuthenticated, force);
router.get('/:slug', detail);
router.get('/', index);

export default router;
