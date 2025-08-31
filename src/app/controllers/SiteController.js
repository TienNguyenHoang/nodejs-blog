import Post from '../models/Post.js';
import User from '../models/User.js';

export const index = async (req, res, next) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(5);
        res.render('home', { title: 'Trang chủ', posts });
    } catch (err) {
        next(err);
    }
};

export const contact = async (req, res, next) => {
    res.render('contact', { title: 'Liên hệ' });
};
