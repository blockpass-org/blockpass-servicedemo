var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
    
// Connection URL
const dbName = 'service_demo'
const collectionName = 'kycmodels'
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
        
        const newDoc = transformData(doc)

        if (newDoc)
            batch.find({ _id: doc._id }).replaceOne(newDoc);
    });

    cursor.once('end', async function () {

        const res = await batch.execute();
        console.log('Finish', res.toJSON());

        client.close();
    });
});



function transformData(item) {
    if (!item.identities) return item;
    const newDoc = { ...item };

    //rename fristName -> firstName
    if (newDoc.identities.fristName) {
        const val = newDoc.identities.fristName
        delete newDoc.identities.fristName
        newDoc.identities.firstName = val;
    }

    return newDoc
}