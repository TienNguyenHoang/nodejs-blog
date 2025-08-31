import express from 'express';

import {
    showLoginForm,
    handleLogin,
    showRegisterForm,
    handleRegister,
    logout,
} from '../app/controllers/AuthController.js';

import { guestRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/login', guestRoute, showLoginForm);
router.post('/login', guestRoute, handleLogin);
router.get('/register', guestRoute, showRegisterForm);
router.post('/register', guestRoute, handleRegister);
router.get('/logout', logout);

export default router;
