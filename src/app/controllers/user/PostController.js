import Post from '../../models/Post.js';
import User from '../../models/User.js';

export const index = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
        res.render('home', { title: 'Bài đăng', posts });
    } catch (err) {
        next(err);
    }
};

export const detail = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'username');
        res.render('home', { title: post.slug, post });
    } catch (err) {
        next(err);
    }
};
