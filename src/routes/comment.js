import express from 'express';

import {
    addComment,
    updateComment,
    deleteComment,
    getComments,
    getReplies,
} from '../app/controllers/CommentController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getComments);
router.get('/replies', getReplies);
router.post('/', isAuthenticated, addComment);
router.put('/:id', isAuthenticated, updateComment);
router.delete('/:id', isAuthenticated, deleteComment);

export default router;
