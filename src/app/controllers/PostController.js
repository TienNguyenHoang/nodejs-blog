import Post from '../models/Post.js';
import User from '../models/User.js';

export const index = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const search = req.query.search || '';
        const query = {
            title: { $regex: search, $options: 'i' },
        };

        const totalPosts = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalPosts / limit);

        res.render('post/index', {
            title: 'Bài đăng',
            activePage: 'posts',
            posts,
            currentPage: page,
            totalPages,
            totalPosts,
            search,
        });
    } catch (err) {
        next(err);
    }
};

export const detail = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'username');
        res.render('post/detail', { title: post.slug, activePage: 'posts', post });
    } catch (err) {
        next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        res.render('post/create', { title: 'Tạo mới bài viết', activePage: 'posts' });
    } catch (err) {
        next(err);
    }
};

export const store = async (req, res, next) => {
    try {
        req.body.author = req.session.user.id;
        const post = new Post(req.body);
        await post.save();
        req.flash('success_msg', 'Tạo bài viết mới thành công!');
        return res.redirect('/');
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.render('post/create', {
                title: 'Tạo mới bài viết',
                activePage: 'posts',
                errors: err.errors,
                data: req.body,
            });
        }
        return res.status(500).send(err);
    }
};
