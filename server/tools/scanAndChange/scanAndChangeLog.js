var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
    
// Connection URL
const dbName = 'service_demo'
const collectionName = 'logmodels'
var url = `mongodb://localhost/${dbName}`;

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    
    var col = client.db(dbName).collection(collectionName);

    var batch = col.initializeOrderedBulkOp();


    // scan all
    var cursor = col.find({});
    cursor.on('data', function (doc) {
        
        const newDoc = transformLogData(doc)

        if (newDoc)
            batch.find({ _id: doc._id }).replaceOne(newDoc);
    });

    cursor.once('end', async function () {

        const res = await batch.execute();
        console.log('Finish', res.toJSON());

        client.close();
    });
});


function transformLogData(item) {
    if (!item.userId) return item;
    const newDoc = { ...item };

    const tmp = newDoc.userId
    delete newDoc.userId
    newDoc.recordId = tmp

    return newDoc
}