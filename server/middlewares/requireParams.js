const joi = require('joi')

// Usage: 
//     mustHaveFields {Array} : List of fields must have

module.exports = function (mustHaveFields = []) {

    const schema = joi.object(mustHaveFields.reduce((acc, itm) => {
        acc[itm] = joi.any().required()
        return acc
    }, {})).unknown(true)

    return function (req, res, next) {
        const body = req.body;
        const err = joi.validate(body, schema).error
        if (err == null)
            next();
        else
            res.status(404).json({
                err: 404,
                msg: err.toString()
            }).end()
    }
}

