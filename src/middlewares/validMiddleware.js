import { body } from 'express-validator';

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

export const editProfileValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email là bắt buộc')
        .isEmail()
        .withMessage('Email không hợp lệ'),
    body('bio').isLength({ max: 200 }).withMessage('Giới thiệu tối đa 200 kí tự!'),
];

export const changePasswordValidator = [
    body('currentPassword').notEmpty().withMessage('Mật khẩu hiện tại không được để trống!'),
    body('newPassword')
        .notEmpty()
        .withMessage('Mật khẩu mới không được để trống!')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự!'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('Xác nhận mật khẩu không được để trống!')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Xác nhận mật khẩu không khớp!');
            }
            return true;
        }),
];
