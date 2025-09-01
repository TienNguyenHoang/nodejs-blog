import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Tên tài khoản không được để trống'],
            minlength: [3, 'Tên tài khoản ít nhất 3 ký tự'],
            unique: [true, 'Tên tài khoản đã tồn tại'],
        },
        email: {
            type: String,
            required: [true, 'Email không được để trống'],
            unique: [true, 'Email đã tồn tại'],
        },
        password: {
            type: String,
            required: [true, 'Mật khẩu không được để trống'],
            minlength: [6, 'Mật khẩu ít nhất 6 ký tự'],
        },
        avatar: { type: String },
        bio: { type: String },
    },
    { timestamps: true },
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
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
