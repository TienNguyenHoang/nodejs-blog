import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const showLoginForm = async (req, res, next) => {
    res.render('auth/login', {
        layout: 'layouts/auth',
        title: 'Đăng nhập',
    });
};

export const handleLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid username or password');
        }

        req.session.user = { id: user._id.toString(), username };

        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

export const showRegisterForm = async (req, res, next) => {
    res.render('auth/register', {
        layout: 'layouts/auth',
        title: 'Đăng ký',
    });
};

export const handleRegister = async (req, res, next) => {
    res.render('contact', { title: 'Liên hệ', activePage: 'contact' });
};

export const logout = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return res.send('Error logging out');
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
};
