const common = require('./_common')

let finalConfig = {};

if (process.env.NODE_ENV == 'production')
    finalConfig = Object.assign({}, common, require('./_prod'))
else if (process.env.NODE_ENV == 'test')
    finalConfig = Object.assign({}, common, require('./_test'))
else
    finalConfig = Object.assign({}, common, require('./_dev'))

// Marked it immutable !
Object.freeze(finalConfig);

module.exports = finalConfig;