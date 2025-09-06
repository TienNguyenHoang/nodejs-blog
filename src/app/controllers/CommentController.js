import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const commentAggregate = function (query, limit) {
    return [
        {
            $match: query,
        },
        { $sort: { createdAt: -1 } },
        { $limit: parseInt(limit) },
        {
            $lookup: {
                from: 'comments',
                let: { parentId: '$_id' },
                pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$parentId'] } } }],
                as: 'replies',
            },
        },
        {
            $addFields: {
                repliesCount: { $size: '$replies' },
            },
        },
        { $project: { replies: 0 } },

        // Lookup user cho root comment
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
                pipeline: [{ $project: { password: 0 } }],
            },
        },
        { $unwind: '$user' },

        // Đảm bảo không trả về password
        {
            $project: {
                'user.password': 0,
                'replies.user.password': 0,
            },
        },
    ];
};

export const getComments = async (req, res, next) => {
    try {
        const { postId, after, limit = 3 } = req.query;
        const query = { post: new mongoose.Types.ObjectId(postId), parent: null };
        if (after && after !== 'undefined') {
            const last = await Comment.findById(after);
            if (last) {
                query.createdAt = { $lt: last.createdAt };
            }
        }
        const comments = await Comment.aggregate(commentAggregate(query, limit));
        const commentsLeftCount = (await Comment.countDocuments(query)) - comments.length;

        res.render('partials/comments-list', { layout: false, comments }, (err, html) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({ success: true, html, commentsLeftCount });
        });
    } catch (err) {
        next(err);
    }
};

export const getReplies = async (req, res, next) => {
    try {
        const { parentId, after, limit = 3 } = req.query;

        const query = { parent: new mongoose.Types.ObjectId(parentId) };
        if (after && after !== 'undefined') {
            const last = await Comment.findById(after);
            if (last) {
                query.createdAt = { $lt: last.createdAt };
            }
        }

        const comments = await Comment.aggregate(commentAggregate(query, limit));
        const repliesLeftCount = (await Comment.countDocuments(query)) - comments.length;

        res.render('partials/comments-list', { layout: false, comments }, (err, html) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false });
            }
            res.json({ success: true, html, repliesLeftCount });
        });
    } catch (err) {
        next(err);
    }
};

export const addComment = async (req, res, next) => {
    try {
        const { postId, parentId, content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Nội dung bình luận không được để trống!' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
        }

        let parentComment = null;
        if (parentId) {
            parentComment = await Comment.findById(parentId);
            if (!parentComment) {
                return res.status(404).json({ success: false, message: 'Comment cha không tồn tại' });
            }
        }

        const comment = new Comment({
            content: content.trim(),
            user: req.session.user.id,
            post: post._id,
            parent: parentId || null,
        });

        await comment.save();

        await comment.populate('user', 'username avatar');
        comment.hasReply = false;
        let eventName = 'new-comment';
        let data = { postId, comment };
        if (parentId) {
            eventName = 'reply-comment';
            data = { parentId, comment };
        }
        req.app.get('io').emit(eventName, data);
        res.json({ success: true, message: 'Tạo bình luận thành công!' });
    } catch (err) {
        next(err);
    }
};

export const updateComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận!' });
        }
        if (String(comment.user) !== String(req.session.user.id)) {
            return res.status(403).json({ success: false, message: 'Không có quyền sửa bình luận này!' });
        }
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Nội dung bình luận không được để trống!' });
        }

        comment.content = content.trim();

        await comment.save();
        req.app.get('io').emit('update-comment', { commentId: comment._id, content: comment.content });
        res.json({ success: true, message: 'Sửa bình luận thành công!' });
    } catch (err) {
        next(err);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận!' });
        }
        if (String(comment.user) !== String(req.session.user.id)) {
            return res.status(403).json({ success: false, message: 'Không có quyền xóa bình luận này!' });
        }

        await comment.deleteOne();
        req.app.get('io').emit('delete-comment', { commentId: comment._id });
        res.json({ success: true, message: 'Xóa bình luận thành công!' });
    } catch (err) {
        next(err);
    }
};
