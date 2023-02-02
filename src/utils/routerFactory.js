const database = require('./database');
const express = require('express');
const md5 = require('md5');

function withCRUD(table) {
    const router = express.Router();

    // 根据 id 删除数据
    router.post('/delete', async (req, res) => {
        let { id } = req.body;
        const { id: cur_id, isAdmin } = req.auth;
        try {
            if (!isAdmin) id = cur_id;
            if (isAdmin && id !== cur_id && cur_id !== 1) throw new Error('只有 admin 可以删除其他管理员账号');
            const result = await database
                .delete(table)
                .where('id', id)
                .execute();
            res.json({ code: 200, ...result });
        } catch ({ message }) {
            res.json({ code: 503, msg: message });
        }
    });

    // 根据 id 更新数据
    router.post('/update', async (req, res) => {
        let { id, password } = req.body;
        const { id: cur_id, isAdmin } = req.auth;
        if (password) password = md5(password);
        try {
            if (!isAdmin) id = cur_id;
            if (isAdmin && id !== cur_id && cur_id !== 1) throw new Error('只有 admin 可以修改其他管理员账号信息');
            const result = await database
                .update(table, { ...req.body, password })
                .where('id', id)
                .execute();
            res.json({ code: 200, ...result });
        } catch ({ message }) {
            res.json({ code: 503, msg: message });
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
            res.json({ code: 200, ...result });
        } catch ({ message }) {
            res.json({ code: 503, msg: message });
        }
    });

    return router;
}

module.exports = { withCRUD };