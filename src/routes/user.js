const { withCRUD } = require('../utils/routerFactory');
const md5 = require('md5');
const database = require('../utils/database');
const router = withCRUD('user');

// 传入 { 字段名: 值 } 插入数据
router.post('insert', async (req, res) => {
    let { password } = req.body;
    if (password) password = md5(password);
    try {
        const result = await database
            .insert('user', { ...req.body, password })
            .execute();
        res.json({ success: true, result });
    } catch (err) {
        res.json({ success: false, err });
    }
});

module.exports = router;