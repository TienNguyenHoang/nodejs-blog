import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { getPaginatedData } from '../../helpers/pagination.js';
import { commentAggregate } from './CommentController.js';
import { query } from 'express-validator';

export const index = async (req, res, next) => {
    try {
        const search = req.query.search || '';
        const query = { title: { $regex: search, $options: 'i' } };

        const result = await getPaginatedData(req, Post, query, {
            populate: { path: 'author', select: 'username' },
            limit: 5,
        });

        res.render('post/index', {
            title: 'Bài đăng',
            activePage: 'posts',
            search,
            ...result,
        });
    } catch (err) {
        next(err);
    }
};

export const detail = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'username').lean();
        if (!post) return next(new Error('Không tìm thấy bài viết'));

        const query = { post: new mongoose.Types.ObjectId(post._id), parent: null };
        const limit = 3;

        const comments = await Comment.aggregate(commentAggregate(query, limit));
        const commentsLeftCount = (await Comment.countDocuments(query)) - comments.length;

        res.render('post/detail', {
            title: post.slug,
            activePage: 'posts',
            post,
            comments,
            commentsLeftCount,
        });
    } catch (err) {
        next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        res.render('post/create', { title: 'Tạo mới bài viết', activePage: 'posts', error: {}, oldInput: {} });
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
        return res.redirect('/me/stored/posts');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const firstError = Object.values(err.errors)[0];
            return res.render('post/create', {
                title: 'Tạo mới bài viết',
                activePage: 'posts',
                error: firstError,
                oldInput: req.body,
            });
        }
        return res.status(500).send(err);
    }
};

export const edit = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('post/edit', { title: 'Sửa bài viết', activePage: null, post, error: {}, oldInput: {} });
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        await Post.updateOne({ _id: req.params.id }, req.body);
        req.flash('success_msg', 'Chỉnh sửa bài viết thành công!');
        return res.redirect('/me/stored/posts');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const post = await Post.findById(req.params.id);
            const firstError = Object.values(err.errors)[0];
            return res.render('post/edit', {
                title: 'Sửa bài viết',
                activePage: null,
                error: firstError,
                post,
                oldInput: req.body,
            });
        }
        return res.status(500).send(err);
    }
};

export const destroy = async (req, res, next) => {
    try {
        await Post.delete({ _id: req.params.id });
        req.flash('success_msg', 'Xóa bài viết thành công!');
        res.redirect('/me/stored/posts');
    } catch (err) {
        next(err);
    }
};

export const force = async (req, res, next) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        req.flash('success_msg', 'Xóa bài viết thành công!');
        res.redirect('/me/trash/posts');
    } catch (err) {
        next(err);
    }
};

export const restore = async (req, res, next) => {
    try {
        await Post.restore({ _id: req.params.id });
        req.flash('success_msg', 'Khôi phục bài viết thành công!');
        res.redirect('/me/stored/posts');
    } catch (err) {
        next(err);
    }
};
