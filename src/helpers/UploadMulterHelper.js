import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploads/avatars/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            req.fileValidationError = 'Chỉ được upload file ảnh, kích thước dưới 2MB!';
            cb(null, false);
        } else {
            cb(null, true);
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 },
});
