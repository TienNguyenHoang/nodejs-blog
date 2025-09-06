import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
    {
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    },
    { timestamps: true },
);

CommentSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const filter = this.getFilter();
    if (filter._id) {
        await mongoose.model('Comment').deleteMany({ parent: filter._id });
    }
    next();
});

export default mongoose.model('Comment', CommentSchema);
