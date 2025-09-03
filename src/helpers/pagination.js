import Post from '../app/models/Post.js';

export const getPaginatedPosts = async (req, queryExtra = {}, { withDeleted = false, onlyDeleted = false } = {}) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const query = {
        title: { $regex: search, $options: 'i' },
        ...queryExtra,
    };

    let queryBuilder;
    if (onlyDeleted) {
        queryBuilder = Post.findWithDeleted({ deleted: true, ...query });
    } else if (withDeleted) {
        queryBuilder = Post.findWithDeleted(query);
    } else {
        queryBuilder = Post.find(query);
    }

    const totalPosts = await queryBuilder.clone().countDocuments();
    const posts = await queryBuilder.populate('author', 'username').sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalPages = Math.ceil(totalPosts / limit);

    return { posts, totalPosts, totalPages, currentPage: page, search };
};
