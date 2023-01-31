const { withCRUD } = require('../utils/routerFactory');
const md5 = require('md5');
const database = require('../utils/database');
const router = withCRUD('admin');

router.post('/insert', async (req, res) => {
    let { password } = req.body;
    if (password) password = md5(password);
    try {
        const result = await database
            .insert('user', { ...req.body, password, is_allow: 0 })
            .execute();
        res.json({ success: true, result });
    } catch (err) {
        res.json({ success: false, err });
    }
});

router.post('/allow', async (req, res) => {
    let { id } = req.body;
    let { isAdmin } = req.auth;
    if (!isAdmin) {
        res.json({
            code: 403,
            msg: '需要管理员权限',
        });
        return;
    }
    try {
        const result = await database
            .update('admin', { is_allow: 1 })
            .where('id', id).execute();
        res.json({ success: true, result });
    } catch (err) {
        res.json({ success: false, err });
    }
});

router.get('/allow/list', async (req, res) => {
    const { page, rows } = req.query;
    let { isAdmin } = req.auth;
    if (!isAdmin) {
        res.json({
            code: 403,
            msg: '需要管理员权限',
        });
        return;
    }
    try {
        let result = await database.select('*')
            .from('admin')
            .where('is_allow', 0)
            .queryListWithPaging(page, rows);
        res.json({ success: true, result });
    } catch (err) {
        res.json({ success: false, err });
    }
});

module.exports = router;