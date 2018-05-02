
// Usage: 
//     mustHaveFileds {Array} : List of fields must have

module.exports = function (mustHaveFileds = []) {
    return function (req, res, next) {
        const body = req.body;        
        if (mustHaveFileds.every(key => {
            if ((body[key]) == null) {
                return false;
            }
            return true;
        }))
            next();
        else 
            res.status(404).json({
                err: 404,
                msg: 'Missing required paramaters: ' + mustHaveFileds.join(',')
            }).end()
    }
}

