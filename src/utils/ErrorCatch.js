const errorCatch = (err, req, res) => {
    // 由 token 解析失败导致的
    if (err?.name === 'UnauthorizedError') {
        res?.json({
            status: 401,
            message: '无效的token',
        });
    }
};

module.exports = errorCatch;