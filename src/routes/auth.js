import express from 'express';

import {
    showLoginForm,
    handleLogin,
    showRegisterForm,
    handleRegister,
    logout,
} from '../app/controllers/AuthController.js';

import { loginValidator, registerValidator } from '../middlewares/validMiddleware.js';
import { guestRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/login', guestRoute, showLoginForm);
router.post('/login', guestRoute, loginValidator, handleLogin);
router.get('/register', guestRoute, showRegisterForm);
router.post('/register', guestRoute, registerValidator, handleRegister);
router.get('/logout', logout);

export default router;
