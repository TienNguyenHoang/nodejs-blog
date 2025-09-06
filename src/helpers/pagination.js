import Post from '../app/models/Post.js';
import Comment from '../app/models/Comment.js';

export const getPaginatedData = async (
    req,
    Model,
    query = {},
    { withDeleted = false, onlyDeleted = false, populate = null, sort = { createdAt: -1 }, limit = 5 } = {},
) => {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    let queryBuilder;
    if (onlyDeleted && typeof Model.findWithDeleted === 'function') {
        queryBuilder = Model.findWithDeleted({ deleted: true, ...query });
    } else if (withDeleted && typeof Model.findWithDeleted === 'function') {
        queryBuilder = Model.findWithDeleted(query);
    } else {
        queryBuilder = Model.find(query);
    }

    const totalDocs = await queryBuilder.clone().countDocuments();

    let docs = queryBuilder.sort(sort).skip(skip).limit(limit);

    if (populate) {
        docs = docs.populate(populate);
    }

    const data = await docs;

    const totalPages = Math.ceil(totalDocs / limit);

    return {
        data,
        totalDocs,
        totalPages,
        currentPage: page,
    };
};
