import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './app/models/User.js';
import Post from './app/models/Post.js';
import Comment from './app/models/Comment.js';

dotenv.config();

// ================= USERS =================
const userData = [
    {
        username: 'alice',
        email: 'alice@example.com',
        password: '123456',
        avatar: '/img/default-avatar.jpg',
        bio: 'Lập trình viên yêu thích Node.js',
    },
    {
        username: 'bob',
        email: 'bob@example.com',
        password: '123456',
        avatar: '/img/default-avatar.jpg',
        bio: 'Frontend dev mê React',
    },
    {
        username: 'charlie',
        email: 'charlie@example.com',
        password: '123456',
        avatar: '/img/default-avatar.jpg',
        bio: 'Backend dev thích Express & MongoDB',
    },
    {
        username: 'david',
        email: 'david@example.com',
        password: '123456',
        avatar: '/img/default-avatar.jpg',
        bio: 'Fullstack developer',
    },
    {
        username: 'eva',
        email: 'eva@example.com',
        password: '123456',
        avatar: '/img/default-avatar.jpg',
        bio: 'Yêu viết blog công nghệ',
    },
];

// ================= POSTS =================
const postData = [
    {
        title: 'Hello World Blog',
        description: 'Bài viết đầu tiên giới thiệu blog',
        content: 'Đây là bài viết đầu tiên của tôi!',
        author: 0,
        tags: ['nodejs', 'mongodb'],
        category: 'IT',
    },
    {
        title: 'Learning Node.js',
        description: 'Khám phá Node.js cơ bản',
        content: 'Node.js thật thú vị khi kết hợp với Express và MongoDB.',
        author: 1,
        tags: ['nodejs', 'express'],
        category: 'IT',
    },
    {
        title: 'Async/Await trong JavaScript',
        description: 'Cách viết code bất đồng bộ dễ hiểu hơn',
        content: 'Async/Await giúp code JS trở nên gọn gàng.',
        author: 2,
        tags: ['javascript', 'async'],
        category: 'IT',
    },
    {
        title: 'Hướng dẫn REST API',
        description: 'REST API với Express',
        content: 'Làm quen với REST API trong Node.js.',
        author: 3,
        tags: ['rest', 'api'],
        category: 'IT',
    },
    {
        title: 'React cơ bản',
        description: 'Bắt đầu với React',
        content: 'JSX, component, props và state.',
        author: 1,
        tags: ['react'],
        category: 'Frontend',
    },
    {
        title: 'React Hooks',
        description: 'Giới thiệu useState và useEffect',
        content: 'React Hooks giúp code dễ đọc hơn.',
        author: 1,
        tags: ['react', 'hooks'],
        category: 'Frontend',
    },
    {
        title: 'MongoDB cho người mới',
        description: 'NoSQL database phổ biến',
        content: 'MongoDB rất mạnh mẽ khi dùng với Node.js.',
        author: 2,
        tags: ['mongodb'],
        category: 'Database',
    },
    {
        title: 'Authentication với JWT',
        description: 'Bảo mật API bằng JSON Web Token',
        content: 'JWT giúp xác thực người dùng dễ dàng.',
        author: 0,
        tags: ['auth', 'jwt'],
        category: 'Security',
    },
    {
        title: 'TypeScript cho JavaScript dev',
        description: 'Static typing cho JS',
        content: 'TypeScript giúp giảm bug runtime.',
        author: 4,
        tags: ['typescript'],
        category: 'IT',
    },
    {
        title: 'TailwindCSS cơ bản',
        description: 'Utility-first CSS framework',
        content: 'Tailwind giúp style nhanh hơn.',
        author: 1,
        tags: ['css', 'tailwind'],
        category: 'Frontend',
    },
    {
        title: 'Deploy Node.js lên Heroku',
        description: 'Triển khai app Node.js',
        content: 'Heroku là nền tảng miễn phí dễ dùng.',
        author: 3,
        tags: ['deploy', 'heroku'],
        category: 'DevOps',
    },
    {
        title: 'Git cơ bản',
        description: 'Làm quen với Git',
        content: 'Git giúp quản lý source code.',
        author: 2,
        tags: ['git'],
        category: 'Tools',
    },
    {
        title: 'Docker cho beginner',
        description: 'Container hoá ứng dụng',
        content: 'Docker giúp devops dễ dàng hơn.',
        author: 3,
        tags: ['docker'],
        category: 'DevOps',
    },
    {
        title: 'Next.js Overview',
        description: 'SSR và SSG với Next.js',
        content: 'Next.js mạnh mẽ cho frontend.',
        author: 1,
        tags: ['nextjs'],
        category: 'Frontend',
    },
    {
        title: 'Viết blog với Markdown',
        description: 'Markdown syntax cơ bản',
        content: 'Markdown tiện lợi khi viết blog.',
        author: 4,
        tags: ['markdown'],
        category: 'Writing',
    },
    {
        title: 'Express Middleware',
        description: 'Hiểu về middleware',
        content: 'Middleware là core của Express.',
        author: 0,
        tags: ['express'],
        category: 'Backend',
    },
    {
        title: 'GraphQL vs REST',
        description: 'So sánh GraphQL và REST API',
        content: 'GraphQL mang lại sự linh hoạt.',
        author: 2,
        tags: ['graphql', 'rest'],
        category: 'API',
    },
    {
        title: 'CSS Flexbox',
        description: 'Layout với Flexbox',
        content: 'Flexbox giúp thiết kế UI dễ dàng.',
        author: 1,
        tags: ['css', 'flexbox'],
        category: 'Frontend',
    },
    {
        title: 'Unit Test trong Node.js',
        description: 'Kiểm thử với Jest',
        content: 'Jest giúp test dễ dàng.',
        author: 0,
        tags: ['test', 'jest'],
        category: 'Testing',
    },
    {
        title: 'CI/CD cơ bản',
        description: 'Tích hợp liên tục',
        content: 'CI/CD giúp deploy tự động.',
        author: 3,
        tags: ['cicd'],
        category: 'DevOps',
    },
];

// ================= COMMENTS =================
const commentData = [
    { content: 'Bài viết hay quá!', post: 0, user: 1 },
    { content: 'Cố lên nhé!', post: 0, user: 2 },
    { content: 'Mình cũng thích Node.js!', post: 1, user: 0 },
    { content: 'Bài này hữu ích.', post: 2, user: 3 },
    { content: 'React quá tuyệt!', post: 4, user: 4 },
    { content: 'Mình mới học MongoDB, cảm ơn!', post: 6, user: 0 },
    { content: 'JWT rất hữu ích!', post: 7, user: 2 },
    { content: 'Bài viết dễ hiểu.', post: 8, user: 1 },
    { content: 'Cần thêm ví dụ chi tiết.', post: 10, user: 3 },
    { content: 'Docker là tương lai!', post: 12, user: 4 },
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
