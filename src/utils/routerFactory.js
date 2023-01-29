const database = require('./database');
const express = require('express');
const md5 = require('md5');
function withCRUD(table){
    const router = express.Router();

    // 传入 { 字段名: 值 } 插入数据
    router.post('/insert', async (req, res) => {
        const data = req.body;
        data.password = md5(data.password);
        try {
            const result = await database
            .insert(table, { ...data }).execute();
            res.json({ success: true, result });
        } catch (err) {
            res.json({ success: false, err });
        }
    });

    // 根据 id 删除数据
    router.post('/delete', async (req, res) => {
        const { id } = req.body;
        try {
            const result = await database
                .delete(table)
                .where('id', id)
                .execute();
            res.json({ success: true, result });
        } catch (err) {
            res.json({ success: false, err });
        }
    });

    // 根据 id 更新数据
    router.post('/update', async (req, res) => {
        const { id } = req.body;
        const data = req.body;
        if(data.password!==undefined){
            data.password = md5(data.password);
        }
        try {
            const result = await database
                .update(table, { ...data })
                .where('id', id)
                .where('is_delete', 0)
                .execute();
            res.json({ success: true, result });
        } catch (err) {
            res.json({ success: false, err });
        }
    });

    // 根据 id 查找数据
    router.get('/find', async (req, res) => {
        const { id } = req.query;
        const result = await database
            .select('*')
            .from(table)
            .where('id', id)
            .where('is_delete', 0)
            .queryRow();
        if(result===undefined){
            res.json({
                success: false,
                msg:'查找失败',
            });
        }
        res.json({ success: true, result });
    });

    return router;
}
module.exports={ withCRUD };