const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const tinify = require('tinify');

const upload = multer({ storage: multer.memoryStorage() });
const basicURL = `http://localhost:${ process.env.PORT }`;
tinify.key = process.env.TINIFY_API_KEY;

/**
 * 上传图片后自动压缩
 * https://tinify.com
 */
function uploadAvatar(isAdmin) {
    return async (req, res) => {
        const { id } = req.body;
        const uploadsPath = path.join(__dirname, `../../public/uploads/${ isAdmin ? 'admin' : 'user' }`);
        try {
            const source = tinify.fromBuffer(req.file.buffer);
            await source.toFile(path.join(uploadsPath, `/jpeg/${ id }.jpeg`));
            await source.toFile(path.join(uploadsPath, `/webp/${ id }.webp`));
            res.json({
                code: 200,
                url: [ `${ basicURL }/webp/${ id }.webp`, `${ basicURL }/jpeg/${ id }.jpeg` ],
            });
        } catch ({ message }) {
            res.json({
                code: 500,
                msg: message,
            });
        }
    };
}

router.post('/avatar/user', upload.single('avatar'), uploadAvatar(false));
router.post('/avatar/admin', upload.single('avatar'), uploadAvatar(true));

module.exports = router;
