module.exports = function (req, res, next) {
    console.log({
        method: req.method,
        path: req.path,
        data: req.body,
        query: req.query
    });
    next();
}