import express from 'express';

import { index, detail, create, store } from '../app/controllers/PostController.js';

const router = express.Router();

router.get('/create', create);
router.post('/store', store);
router.get('/:slug', detail);
router.get('/', index);

export default router;
