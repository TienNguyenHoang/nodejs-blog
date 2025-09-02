import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';

export const showLoginForm = async (req, res, next) => {
    res.render('auth/login', {
        layout: 'layouts/auth',
        title: 'Đăng nhập',
        error: {},
        oldInput: {},
    });
};

export const handleLogin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/login', {
                layout: 'layouts/auth',
                title: 'Đăng nhập',
                error: errors.array().shift(),
                oldInput: req.body,
            });
        }

        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).render('auth/login', {
                layout: 'layouts/auth',
                title: 'Đăng nhập',
                error: { msg: 'Sai thông tin đăng nhập!' },
                oldInput: req.body,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).render('auth/login', {
                layout: 'layouts/auth',
                title: 'Đăng nhập',
                error: { msg: 'Sai thông tin đăng nhập!' },
                oldInput: req.body,
            });
        }

        req.session.user = {
            id: user._id.toString(),
            username,
            email: user.email,
            bio: user.bio,
            avatar: user.avatar,
        };
        req.flash('success_msg', 'Đăng nhập thành công!');
        return res.redirect('/');
    } catch (err) {
        next(err);
    }
};

export const showRegisterForm = async (req, res, next) => {
    res.render('auth/register', {
        layout: 'layouts/auth',
        title: 'Đăng ký',
        error: {},
        oldInput: {},
    });
};

export const handleRegister = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/register', {
                layout: 'layouts/auth',
                title: 'Đăng ký',
                error: errors.array().shift(),
                oldInput: req.body,
            });
        }

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).render('auth/register', {
                layout: 'layouts/auth',
                title: 'Đăng ký',
                error: { msg: 'Tên tài khoản đã tồn tại' },
                oldInput: req.body,
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).render('auth/register', {
                layout: 'layouts/auth',
                title: 'Đăng ký',
                error: { msg: 'Email đã tồn tại' },
                oldInput: req.body,
            });
        }

        const newUser = new User({
            username,
            email,
            password, // UserSchema preSave hashed password
            avatar: '/img/default-avatar.jpg',
        });

        await newUser.save();

        req.session.user = {
            id: newUser._id.toString(),
            username: newUser.username,
            email: newUser.email,
            bio: newUser.bio,
            avatar: newUser.avatar,
        };
        req.flash('success_msg', 'Đăng ký thành công, chào mừng bạn!');
        return res.redirect('/');
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    req.flash('success_msg', 'Đăng xuất thành công. Hẹn gặp lại!');
    req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
};
