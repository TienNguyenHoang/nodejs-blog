import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
import MongooseDelete from 'mongoose-delete';

const Schema = mongoose.Schema;

mongoose.plugin(slug);

const PostSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        tags: [{ type: String }],
        category: { type: String },
        coverImage: { type: String },
        slug: { type: String, slug: 'title', unique: true },
    },
    {
        timestamps: true,
    },
);

PostSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: 'all' });

export default mongoose.model('Post', PostSchema);
