const Duplex = require('stream').Duplex;
const mongoose = require('mongoose');
const Gridfs = require('gridfs-stream');

const GRIDFS_COLLECTION = 'kycAttachment'

let gfs;
mongoose.connection.on('connected', function () {
    const db = mongoose.connection.db;
    const mongoDriver = mongoose.mongo;
    gfs = new Gridfs(db, mongoDriver);
})

function _bufferToStream(buffer) {
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

module.exports.writeFile = function ({ fileName, mimetype, metadata, fileBuffer }) {
    return new Promise((resolve, reject) => {
        let writestream = gfs.createWriteStream({
            filename: fileName,
            mode: 'w',
            content_type: mimetype,
            root: GRIDFS_COLLECTION,
            metadata: metadata || {}
        });
        _bufferToStream(fileBuffer).pipe(writestream);

        writestream.on('close', function (file) {
            resolve(file)
        })
    })
}

module.exports.readFile = function (_id) {
    var readstream = gfs.createReadStream({
        _id,
        root: GRIDFS_COLLECTION
    });
    return readstream
}

module.exports.readFileAsBuffer = function (_id) {
    return new Promise((resolve, reject) => {
        var bufs = [];
        var readstream = gfs.createReadStream({
            _id,
            root: GRIDFS_COLLECTION
        });
        readstream.on('data', d => bufs.push(d))
        readstream.on('end', () => {
            resolve(Buffer.from(bufs));
        })
    })
}