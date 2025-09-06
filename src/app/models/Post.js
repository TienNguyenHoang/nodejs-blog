import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
import MongooseDelete from 'mongoose-delete';

const Schema = mongoose.Schema;

mongoose.plugin(slug);

const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Tiêu đề bắt buộc'],
            minlength: [5, 'Tiêu đề ít nhất 5 ký tự'],
            maxlength: [100, 'Tiêu đề tối đa 100 ký tự'],
        },
        description: {
            type: String,
            required: [true, 'Mô tả bắt buộc'],
            minlength: [10, 'Mô tả ít nhất 10 ký tự'],
        },
        content: { type: String, required: [true, 'Nội dung không được để trống'] },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        tags: {
            type: [String],
            validate: {
                validator: function (arr) {
                    return arr.length <= 4;
                },
                message: 'Tối đa 4 tag',
            },
        },
        category: { type: String, required: [true, 'Thể loại không được để trống'] },
        slug: { type: String, slug: 'title', unique: true },
    },
    {
        timestamps: true,
    },
);

PostSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const filter = this.getFilter();
    if (filter._id) {
        await mongoose.model('Comment').deleteMany({ post: filter._id });
    }
    next();
});

PostSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: 'all' });

export default mongoose.model('Post', PostSchema);
