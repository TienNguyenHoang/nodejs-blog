import express from 'express';

import {
    showEditProfile,
    updateProfile,
    showChangPassword,
    handleChangePassword,
    storePosts,
    trashPosts,
} from '../app/controllers/MeController.js';
import { editProfileValidator, changePasswordValidator } from '../middlewares/validMiddleware.js';
import { upload } from '../helpers/UploadMulterHelper.js';

const router = express.Router();

router.get('/editProfile', showEditProfile);
router.put('/editProfile', upload.single('avatar'), editProfileValidator, updateProfile);
router.get('/changePassword', showChangPassword);
router.put('/changePassword', changePasswordValidator, handleChangePassword);
router.get('/stored/posts', storePosts);
router.get('/trash/posts', trashPosts);

export default router;
