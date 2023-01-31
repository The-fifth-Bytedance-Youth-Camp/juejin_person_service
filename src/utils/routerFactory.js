const database = require('./database');
const express = require('express');
const md5 = require('md5');

function withCRUD(table) {
    const router = express.Router();

    // 根据 id 删除数据
    router.post('/delete', async (req, res) => {
        const { id } = req.body;
        try {
            const result = await database
                .delete(table)
                .where('id', id)
                .execute();
            res.json({ success: true, result });
        } catch ({ message }) {
            res.json({ success: false, msg: message });
        }
    });

    // 根据 id 更新数据
    router.post('/update', async (req, res) => {
        let { id, password } = req.body;
        if (id && password) return res.json({ code: 401, msg: 'Miss id or password' });
        password = md5(password);
        try {
            const result = await database
                .update(table, { ...req.body })
                .where('id', id)
                .where('password', password)
                .execute();
            res.json({ success: true, result });
        } catch ({ message }) {
            res.json({ success: false, msg: message });
        }
    });

    // 根据 id 查找数据
    router.get('/find', async (req, res) => {
        let { id } = req.auth;
        try {
            const result = await database
                .select('*')
                .from(table)
                .where('id', id)
                .queryRow();
            if (!result) throw new Error('找不到数据');
            delete result?.password;
            res.json({ success: true, result });
        } catch ({ message }) {
            res.json({ success: false, msg: message });
        }
    });

    return router;
}

module.exports = { withCRUD };