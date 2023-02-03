const { withCRUD } = require('../utils/routerFactory');
const md5 = require('md5');
const database = require('../utils/database');
const moment = require('moment');
const router = withCRUD('user');

router.post('/insert', async (req, res) => {
    let { password } = req.body;
    if (password) password = md5(password);
    const gmt_created = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
        const result = await database
            .insert('user', { ...req.body, password, gmt_created })
            .execute();
        res.json({ code: 200, result });
    } catch ({ message }) {
        res.json({ code: 503, err: message });
    }
});

module.exports = router;