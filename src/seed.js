import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './app/models/User.js';
import Post from './app/models/Post.js';
import Comment from './app/models/Comment.js';

dotenv.config();

const userData = [
    {
        username: 'alice',
        email: 'alice@example.com',
        password: '123456',
        avatar: '/img/default-avatar.jpg',
        bio: 'bio',
    },
    {
        username: 'bob',
        email: 'bob@example.com',
        password: '123456',
        avatar: '/img/default-avatar.jpg',
        bio: 'bio',
    },
];

const postData = [
    {
        title: 'Hello World Blog',
        description: 'Mô tả',
        content: 'Đây là bài viết đầu tiên của tôi!',
        author: 0,
        tags: ['nodejs, mongodb'],
        category: 'IT',
        coverImage: '/img/no-image.jpg',
    },
    {
        title: 'Learning Node.js',
        description: 'Mô tả',
        content: 'Node.js thật thú vị khi kết hợp với Express và MongoDB.',
        author: 1,
        tags: ['nodejs, mongodb'],
        category: 'IT',
        coverImage: '/img/no-image.jpg',
    },
];

const commentData = [
    { content: 'Bài viết hay quá!', post: 0, user: 1 },
    { content: 'Cố lên nhé!', post: 0, user: 1 },
    { content: 'Mình cũng thích Node.js!', post: 1, user: 0 },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        await Promise.all([User.deleteMany({}), Post.deleteMany({}), Comment.deleteMany({})]);
        console.log('Old data cleared');

        const users = [];
        for (const u of userData) {
            const user = await User.create(u);
            users.push(user);
        }
        console.log('Users created');

        const posts = [];
        for (const p of postData) {
            const author = users[p.author]._id;
            const post = await Post.create({
                ...p,
                author,
            });
            posts.push(post);
        }
        console.log('Posts created');

        for (const c of commentData) {
            const post = posts[c.post]._id;
            const user = users[c.user]._id;
            await Comment.create({
                ...c,
                post,
                user,
            });
        }
        console.log('Comments created');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
}

seed();
