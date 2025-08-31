import express from 'express';

import { index, contact } from '../app/controllers/SiteController.js';

const router = express.Router();

router.get('/contact', contact);
router.get('/', index);

export default router;
