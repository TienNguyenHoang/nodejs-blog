import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String },
        bio: { type: String },
    },
    { timestamps: true },
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // chỉ hash nếu password thay đổi hoặc tạo mới
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
