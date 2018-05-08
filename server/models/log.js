const winston = require('winston');
require('winston-daily-rotate-file');
const util = require('util');

const logger = winston.createLogger({
    level: 'verbose',
    timestamp: true,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 

const myFormat = winston.format.printf(info => {
    return `${info.level} ${info.message}`;
});


if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            myFormat
        ),
        handleExceptions: true
    }));
   
} else {
    logger.add(new winston.transports.DailyRotateFile({ 
        level: 'error',
        handleExceptions: true,
        exitOnError: false,
        filename: '.logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
    }));
    logger.add(new winston.transports.DailyRotateFile({ 
        filename: '.logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
    }));
}


//----------------------------------------------------------------//
// Console log utils
//----------------------------------------------------------------//
function formatArgs(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function () {
    logger.verbose.apply(logger, formatArgs(arguments));
};
console.info = function () {
    logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function () {
    logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function () {
    logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function () {
    logger.debug.apply(logger, formatArgs(arguments));
};