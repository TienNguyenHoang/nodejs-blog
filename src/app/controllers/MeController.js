import { validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

import Post from '../models/Post.js';
import User from '../models/User.js';

import { getPaginatedData } from '../../helpers/pagination.js';

export async function showEditProfile(req, res, next) {
    try {
        res.render('me/editProfile', {
            title: 'Chỉnh sửa hồ sơ',
            activePage: null,
            error: {},
            oldInput: {},
        });
    } catch (err) {
        next(err);
    }
}

export async function updateProfile(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.render('me/editProfile', {
                title: 'Chỉnh sửa hồ sơ',
                activePage: null,
                error: errors.array().shift(),
                oldInput: req.body,
            });
        }

        const user = await User.findById(req.session.user.id);
        if (!user) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.render('me/editProfile', {
                title: 'Chỉnh sửa hồ sơ',
                activePage: null,
                error: { msg: 'Không tìm thấy người dùng!' },
                oldInput: req.body,
            });
        }

        const existingEmail = await User.findOne({
            email: req.body.email,
            _id: { $ne: user.id },
        });
        if (existingEmail) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).render('me/editProfile', {
                title: 'Chỉnh sửa hồ sơ',
                activePage: null,
                error: { msg: 'Email đã tồn tại' },
                oldInput: req.body,
            });
        }

        if (req.fileValidationError) {
            return res.status(400).render('me/editProfile', {
                title: 'Chỉnh sửa hồ sơ',
                activePage: null,
                error: { msg: req.fileValidationError },
                oldInput: req.body,
            });
        }

        user.email = req.body.email;
        user.bio = req.body.bio;

        if (req.file) {
            if (user.avatar && !user.avatar.includes('default-avatar.jpg')) {
                const oldPath = path.join('src', 'public', user.avatar);
                fs.unlink(oldPath, (err) => {
                    if (err) {
                        console.error('Không thể xóa ảnh cũ:', err.message);
                    }
                });
            }

            user.avatar = '/uploads/avatars/' + req.file.filename;
        }
        await user.save();

        req.session.user = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            bio: user.bio,
            avatar: user.avatar,
        };

        req.flash('success_msg', 'Cập nhật hồ sơ thành công!');
        res.redirect('/me/editProfile');
    } catch (err) {
        next(err);
    }
}

export async function showChangPassword(req, res, next) {
    try {
        res.render('me/changePassword', {
            title: 'Đổi mật khẩu',
            activePage: null,
            error: {},
        });
    } catch (err) {
        next(err);
    }
}

export async function handleChangePassword(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('me/changePassword', {
                title: 'Đổi mật khẩu',
                activePage: null,
                error: errors.array().shift(),
            });
        }

        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.render('me/changePassword', {
                title: 'Đổi mật khẩu',
                activePage: null,
                error: { msg: 'Không tìm thấy người dùng!' },
            });
        }

        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).render('me/changePassword', {
                title: 'Đổi mật khẩu',
                activePage: null,
                error: { msg: 'Mật khẩu hiện tại không đúng' },
            });
        }

        user.password = req.body.newPassword; // UserSchema preSave hashed password
        await user.save();

        req.flash('success_msg', 'Đổi mật khẩu thành công!');
        res.redirect('/me/changePassword');
    } catch (err) {
        next(err);
    }
}

export async function storePosts(req, res, next) {
    try {
        const search = req.query.search || '';
        const query = { title: { $regex: search, $options: 'i' }, author: req.session.user.id };

        const result = await getPaginatedData(req, Post, query, {
            limit: 5,
        });

        const deletedCount = await Post.countDocumentsWithDeleted({ deleted: true });

        res.render('me/stored-posts', {
            title: 'Bài viết của tôi',
            activePage: null,
            deletedCount,
            search,
            ...result,
        });
    } catch (err) {
        next(err);
    }
}

export async function trashPosts(req, res, next) {
    try {
        const search = req.query.search || '';
        const query = { title: { $regex: search, $options: 'i' }, author: req.session.user.id };

        const result = await getPaginatedData(req, Post, query, {
            onlyDeleted: true,
            limit: 5,
        });

        res.render('me/trash-posts', {
            title: 'Thùng rác',
            activePage: null,
            search,
            ...result,
        });
    } catch (err) {
        next(err);
    }
}
