module.exports = function (req, res, next) {
    console.log('\x1b[36m%s\x1b[0m', '[verbose]', {
        method: req.method,
        path: req.path,
        data: req.body,
        query: req.query
    });
    next();
}