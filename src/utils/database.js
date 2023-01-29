const DbClient = require('ali-mysql-client');

const database = new DbClient({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'juejin_person',
});

module.exports = database;