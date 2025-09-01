import { body } from 'express-validator';

export function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
}

export function guestRoute(req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}

export function getCurrentUser(req, res, next) {
    res.locals.currentUser = req.session.user || null;
    next();
}

export const loginValidator = [
    body('username').notEmpty().withMessage('Tên tài khoản không được để trống'),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
];

export const registerValidator = [
    body('username')
        .notEmpty()
        .withMessage('Tên tài khoản không được để trống')
        .isLength({ min: 3 })
        .withMessage('Tên tài khoản phải ít nhất 3 ký tự'),

    body('email')
        .notEmpty()
        .withMessage('Email không được để trống')
        .isEmail()
        .withMessage('Email không hợp lệ'),

    body('password')
        .notEmpty()
        .withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải ít nhất 6 ký tự'),

    body('confirmPassword')
        .notEmpty()
        .withMessage('Vui lòng xác nhận mật khẩu')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }
            return true;
        }),
];
