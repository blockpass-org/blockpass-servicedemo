const crypto = require('crypto');

exports.KYCModel = [
    {
        _id: '5abbc4581ed21a26a5b63757',

        status: 'waiting',
        identities: {
            email: 'Ethan67@hotmail.com',
        },
        extraData: {
            etherAddress: 'iamhere',
        }
    },
    {
        _id: '5abbcbe4b20e722bf3819438',
        status: 'waiting',
        identities: {
            phone: '1-447-434-2209 x11823',
        }
    },
    {
        _id: '5abbcc8160f9ab2c5a7801ef',
        status: 'waiting',
        blockPassID: '1522257024962',
        identities: {
            firstName: 'Penelope',
            lastName: 'Borer',
            phone: '1-064-253-8791 x03521',
            email: 'Susanna.Durgan89@yahoo.com',
        }
    },
    {
        _id: '5abc6d25442beeb2d731dc3a',
        status: 'waiting',
        identities: {
            phone: '000.000.000',
        }

    },
    {
        _id: '5abc6d25442beeb2d731dc3b',
        status: 'waiting',
        identities: {
            email: 'duplicate@emall.com',
        }

    },
    {
        _id: '5abdb8db1e07d7e4dbcc6673',
        status: 'approved',
        identities: {
            email: 'approved@emall.com',
        }

    },
    {
        _id: '5abdb47f1e07d7e4dbcc6670',
        status: 'waiting',
        blockPassID: '1522257024963',

        identities: {
            firstName: 'i am',
            lastName: 'success review',
            phone: '10642538791',
            email: 'success@review.com',
        }

    },
    {
        _id: '5abdb7011e07d7e4dbcc6672',
        status: 'waiting',
        blockPassID: '1522257024964',
        identities: {
            firstName: 'i am',
            lastName: 'failed',
            phone: '10642538791',
            email: 'failed@review.com',
        }

    },
    {
        "_id": "5ad967142219d02223ae44b2",
        "bpToken": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJCTE9DS1BBU1MiLCJzdWIiOiI1YWQ4NjIyNDBhMTc2NzIyZjI1ZmVkZTIiLCJhdWQiOiIzcmRfc2VydmljZV9kZW1vIiwiZXhwIjoxNTI0NDMzMTM5LCJpYXQiOjE1MjQxOTcxMzksImp0aSI6IjU0NjY5NzAxZjY1YTg4NzllNDUwNzdiZTcwYTg0MzgyIn0.LVDTfo19N_L_YQ7d1AGlUYdYy_iUNqz4nxwDa5cSRvQ",
            "expires_at": new Date("3018-04-20T05:05:40.588Z"),
            "refresh_token": "54669701f65a8879e45077be70a84382"
        },
        "status": "waiting",
        "blockPassID": "5ad862240a176722f25fede2",
        "identities": {
            "lastName": "West",
            "firstName": "Orrin",
            "phone": "839-551-5834 x313",
            "picture": "5ad967142219d02223ae44b3",
        },
        "bpProfile": {
            "smartContractId": "0x8db034dddc102383174eb4f4e5b45fc688e1ba46923e824791840abc0df6c857",
            "rootHash": "982ddceb1807c8261a20b5b672dd9c7fc5bd18d30fde9dfb9769f8e3b581e300",
            "isSynching": false,
        },
        "extraData": {
            "etherAddress": "0xab3Bb972B8dF9431d73E8296673992a202A8EC4d"
        },
        "createdAt": new Date("2018-04-20T04:05:40.588Z"),
        "updatedAt": new Date("2018-04-20T04:06:02.119Z"),
        "__v": 0,

    },
    {
        "_id": "5ad967142219d02223ae44b3",
        "bpToken": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJCTE9DS1BBU1MiLCJzdWIiOiI1YWQ4NjIyNDBhMTc2NzIyZjI1ZmVkZTIiLCJhdWQiOiIzcmRfc2VydmljZV9kZW1vIiwiZXhwIjoxNTI0NDMzMTM5LCJpYXQiOjE1MjQxOTcxMzksImp0aSI6IjU0NjY5NzAxZjY1YTg4NzllNDUwNzdiZTcwYTg0MzgyIn0.LVDTfo19N_L_YQ7d1AGlUYdYy_iUNqz4nxwDa5cSRvQ",
            "expires_at": new Date("1018-04-20T05:05:40.588Z"),
            "refresh_token": "54669701f65a8879e45077be70a84382"
        },
        "status": "inreview",
        "blockPassID": "5ad862240a176722f25fede3",
        "identities": {
            "lastName": "West1",
            "firstName": "Orrin1",
            "phone": "839-551-5834 x313",
            "picture": "5ad967142219d02223ae44b3",
        },
        "bpProfile": {
            "smartContractId": "0x8db034dddc102383174eb4f4e5b45fc688e1ba46923e824791840abc0df6c859",
            "rootHash": "982ddceb1807c8261a20b5b672dd9c7fc5bd18d30fde9dfb9769f8e3b581e300",
            "isSynching": false,
        },
        "certs": {
            "onfidoCertificate": '{"@context":{"schema":"http://blockpass.org/api/","given_name":"schema:given_name","family_name":"schema:family_name","address":"schema:address","dob":"schema:dob","phone":"schema:phone","passport":"schema:passport","selfie":"schema:selfie","proof_of_address":"schema:proof_of_address"},"@type":"Person","@did":"bp:5af12e922ade3e29b62bb730","service":{"name":"Onfido","logo":"/api/private/image/onfido_cert_logo.png","thumbnail":"/api/private/image/onfido_cert_thumbnail.png"},"given_name":"0e32a320e97518e6ade7014457d4467ac5fbd63b57c4f21ce30f7ca3749d3afc","family_name":"c5220bda1c1a97fc835fc28a9474947cd20c84dc83d16e9baca3a4cee9b07e70","address":"1819fae57ea0841e647ed634e0f9846faa58edca1bcf346684d031fd6fffcb8c","dob":"75a8d273b35262c82cd0b824e4a27663569eac3296a94074580084d8b4f98026","phone":"e79e05d01136b71e5eee7e339260fdd6a7a57485a9e27579117b78a73bc72e30","passport":"20fd63b40975a17fe4e2f010a0762009877f0ed549df130fda0e9bbf5ea32089","selfie":"1cb743b89d12d9d16c65335560e57dcc195ce340492669ac288026ca08ad8da2","proof_of_address":"5607ca8f7e7520c85040c4f45f8a9a6f7275db55f4ef8ec62572b0111f5ae44d","onfido_report":{"result":"clear","breakdown":{"visual_authenticity":{"result":"clear","breakdown":{"other":{"result":"clear"},"face_detection":{"result":"clear"}}},"data_consistency":{"result":"clear","breakdown":{"document_type":{"result":"clear"},"nationality":{"result":"clear"},"date_of_expiry":{"result":"clear"},"date_of_birth":{"result":"clear"},"document_numbers":{"result":"clear"},"gender":{"result":"clear"},"last_name":{"result":"clear"},"first_name":{"result":"clear"},"issuing_country":{"result":"clear"}}},"image_integrity":{"result":"clear","breakdown":{"image_quality":{"result":"clear"},"supported_document":{"result":"clear"}}},"police_record":{"result":"clear"},"data_validation":{"result":"clear","breakdown":{"expiry_date":{"result":"clear"},"date_of_birth":{"result":"clear"},"document_expiration":{"result":"clear"},"document_numbers":{"result":"clear"},"gender":{"result":"clear"},"mrz":{"result":"clear"}}},"data_comparison":{"result":"clear","breakdown":{"document_type":{"result":"clear"},"date_of_expiry":{"result":"clear"},"date_of_birth":{"result":"clear"},"document_numbers":{"result":"clear"},"gender":{"result":"clear"},"last_name":{"result":"clear"},"first_name":{"result":"clear"},"issuing_country":{"result":"clear"}}}},"variant":"standard","created_at":"2018-04-16T10:04:06Z","name":"document","sub_result":"clear","status":"complete"}}'
        },
        "createdAt": new Date("2018-04-20T04:05:40.588Z"),
        "updatedAt": new Date("2018-04-20T04:06:02.119Z"),
        "__v": 0,
        "extraData": {
            "etherAddress": "0xab3Bb972B8dF9431d73E8296673992a202A8EC4e"
        },
        "reviewer": "5ab927981e28a8033f3e06cf"
    },
    {
        "_id": "5ae198afc55d973b6032981f",
        "bpToken": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJCTE9DS1BBU1MiLCJzdWIiOiI1YWQ4NjIyNDBhMTc2NzIyZjI1ZmVkZTIiLCJhdWQiOiIzcmRfc2VydmljZV9kZW1vIiwiZXhwIjoxNTI0NDMzMTM5LCJpYXQiOjE1MjQxOTcxMzksImp0aSI6IjU0NjY5NzAxZjY1YTg4NzllNDUwNzdiZTcwYTg0MzgyIn0.LVDTfo19N_L_YQ7d1AGlUYdYy_iUNqz4nxwDa5cSRvQ",
            "expires_at": new Date("3018-04-20T05:05:40.588Z"),
            "refresh_token": "54669701f65a8879e45077be70a84382"
        },
        "status": "inreview",
        "blockPassID": "5ad862240a176722f25fede5",
        "identities": {
            "lastName": "West1",
            "firstName": "Orrin1",
            "phone": "839-551-5834 x313",
            "picture": "5ad967142219d02223ae44b3",
        },
        "bpProfile": {
            "smartContractId": "0x8db034dddc102383174eb4f4e5b45fc688e1ba46923e824791840abc0df6c859",
            "rootHash": "982ddceb1807c8261a20b5b672dd9c7fc5bd18d30fde9dfb9769f8e3b581e300",
            "isSynching": false,
        },
        "certs": {
            "onfidoCertificate": '{"@context":{"schema":"http://blockpass.org/api/","given_name":"schema:given_name","family_name":"schema:family_name","address":"schema:address","dob":"schema:dob","phone":"schema:phone","passport":"schema:passport","selfie":"schema:selfie","proof_of_address":"schema:proof_of_address"},"@type":"Person","@did":"bp:5af12e922ade3e29b62bb730","service":{"name":"Onfido","logo":"/api/private/image/onfido_cert_logo.png","thumbnail":"/api/private/image/onfido_cert_thumbnail.png"},"given_name":"0e32a320e97518e6ade7014457d4467ac5fbd63b57c4f21ce30f7ca3749d3afc","family_name":"c5220bda1c1a97fc835fc28a9474947cd20c84dc83d16e9baca3a4cee9b07e70","address":"1819fae57ea0841e647ed634e0f9846faa58edca1bcf346684d031fd6fffcb8c","dob":"75a8d273b35262c82cd0b824e4a27663569eac3296a94074580084d8b4f98026","phone":"e79e05d01136b71e5eee7e339260fdd6a7a57485a9e27579117b78a73bc72e30","passport":"20fd63b40975a17fe4e2f010a0762009877f0ed549df130fda0e9bbf5ea32089","selfie":"1cb743b89d12d9d16c65335560e57dcc195ce340492669ac288026ca08ad8da2","proof_of_address":"5607ca8f7e7520c85040c4f45f8a9a6f7275db55f4ef8ec62572b0111f5ae44d","onfido_report":{"result":"clear","breakdown":{"visual_authenticity":{"result":"clear","breakdown":{"other":{"result":"clear"},"face_detection":{"result":"clear"}}},"data_consistency":{"result":"clear","breakdown":{"document_type":{"result":"clear"},"nationality":{"result":"clear"},"date_of_expiry":{"result":"clear"},"date_of_birth":{"result":"clear"},"document_numbers":{"result":"clear"},"gender":{"result":"clear"},"last_name":{"result":"clear"},"first_name":{"result":"clear"},"issuing_country":{"result":"clear"}}},"image_integrity":{"result":"clear","breakdown":{"image_quality":{"result":"clear"},"supported_document":{"result":"clear"}}},"police_record":{"result":"clear"},"data_validation":{"result":"clear","breakdown":{"expiry_date":{"result":"clear"},"date_of_birth":{"result":"clear"},"document_expiration":{"result":"clear"},"document_numbers":{"result":"clear"},"gender":{"result":"clear"},"mrz":{"result":"clear"}}},"data_comparison":{"result":"clear","breakdown":{"document_type":{"result":"clear"},"date_of_expiry":{"result":"clear"},"date_of_birth":{"result":"clear"},"document_numbers":{"result":"clear"},"gender":{"result":"clear"},"last_name":{"result":"clear"},"first_name":{"result":"clear"},"issuing_country":{"result":"clear"}}}},"variant":"standard","created_at":"2018-04-16T10:04:06Z","name":"document","sub_result":"clear","status":"complete"}}'
        },
        "createdAt": new Date("2018-04-20T04:05:40.588Z"),
        "updatedAt": new Date("2018-04-20T04:06:02.119Z"),
        "__v": 0,
        "extraData": {
            "etherAddress": "0xab3Bb972B8dF9431d73E8296673992a202A8EC4e"
        },
        "reviewer": "5ab927981e28a8033f3e06cf"
    },
    {
        "_id": "5addc3a70476a51e3c3f4290",
        "status": "approved",
        "blockPassID": "5add9d06d528887989b362d4",
        "bpProfile": {
            "rootHash": "01edf3645eef35d41b315523b5f62849f3ca0dbc07b3562d9245d9c7ce88a2bb",
            "smartContractId": "0xd28bc829e182091fdaca8ca779bf2d56c52455c9858c8930b5a7b8922f29d3db",
            "isSynching": false,
        },
        
        "createdAt": new Date("2018-04-23T11:29:43.078Z"),
        "updatedAt": new Date("2018-04-23T11:30:08.640Z"),
        "__v": 0,
        "bpToken": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJCTE9DS1BBU1MiLCJzdWIiOiI1YWRkOWQwNmQ1Mjg4ODc5ODliMzYyZDQiLCJhdWQiOiIzcmRfc2VydmljZV9kZW1vIiwiZXhwIjoxNTI0NzE4OTgzLCJpYXQiOjE1MjQ0ODI5ODMsImp0aSI6IjE2MmYzODMyMDk1YmNmNWQyN2MwZGMzNmQ4YzYzMWYwIn0.59s2AiewKMtvvnwZLh92mSt-yh-92uuVQhcqCuyk5Qs",
            "expires_at": new Date("3018-04-23T12:29:44.453Z"),
            "refresh_token": "162f3832095bcf5d27c0dc36d8c631f0"
        },
        "identities": {
            "firstName": "Katlyn",
            "lastName": "Greenfelder",
            "phone": "721.680.0252 x23087",
            "picture": "5addc3a80476a51e3c3f4291",
        },
        "reviewer": "5add9bf3cfa5c70dc44178f1"
    },
    {
        "_id": "5addc3a70476a51e3c3f4291",
        "status": "approved",
        "blockPassID": "5add9d06d528887989b362d4",
        "bpProfile": {
            "rootHash": "01edf3645eef35d41b315523b5f62849f3ca0dbc07b3562d9245d9c7ce88a2bb",
            "smartContractId": "0xd28bc829e182091fdaca8ca779bf2d56c52455c9858c8930b5a7b8922f29d3db",
            "isSynching": false,
        },

        "createdAt": new Date("2018-04-23T11:29:43.078Z"),
        "updatedAt": new Date("2018-04-23T11:30:08.640Z"),
        "__v": 0,
        "bpToken": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJCTE9DS1BBU1MiLCJzdWIiOiI1YWRkOWQwNmQ1Mjg4ODc5ODliMzYyZDQiLCJhdWQiOiIzcmRfc2VydmljZV9kZW1vIiwiZXhwIjoxNTI0NzE4OTgzLCJpYXQiOjE1MjQ0ODI5ODMsImp0aSI6IjE2MmYzODMyMDk1YmNmNWQyN2MwZGMzNmQ4YzYzMWYwIn0.59s2AiewKMtvvnwZLh92mSt-yh-92uuVQhcqCuyk5Qs",
            "expires_at": new Date("3018-04-23T12:29:44.453Z"),
            "refresh_token": "162f3832095bcf5d27c0dc36d8c631f0"
        },
        "identities": {
            "firstName": "Katlyn",
            "lastName": "Greenfelder",
            "phone": "721.680.0252 x23087",
            "picture": "5addc3a80476a51e3c3f4291",
            "reviewer": "5add9bf3cfa5c70dc44178f1",
        },
        "certs": {
            "onfidoCertificate": '{"@context":{"schema":"http://blockpass.org/api/","given_name":"schema:given_name","family_name":"schema:family_name","address":"schema:address","dob":"schema:dob","phone":"schema:phone","passport":"schema:passport","selfie":"schema:selfie","proof_of_address":"schema:proof_of_address"},"@type":"Person","@did":"bp:5af12e922ade3e29b62bb730","service":{"name":"Onfido","logo":"/api/private/image/onfido_cert_logo.png","thumbnail":"/api/private/image/onfido_cert_thumbnail.png"},"given_name":"0e32a320e97518e6ade7014457d4467ac5fbd63b57c4f21ce30f7ca3749d3afc","family_name":"c5220bda1c1a97fc835fc28a9474947cd20c84dc83d16e9baca3a4cee9b07e70","address":"1819fae57ea0841e647ed634e0f9846faa58edca1bcf346684d031fd6fffcb8c","dob":"75a8d273b35262c82cd0b824e4a27663569eac3296a94074580084d8b4f98026","phone":"e79e05d01136b71e5eee7e339260fdd6a7a57485a9e27579117b78a73bc72e30","passport":"20fd63b40975a17fe4e2f010a0762009877f0ed549df130fda0e9bbf5ea32089","selfie":"1cb743b89d12d9d16c65335560e57dcc195ce340492669ac288026ca08ad8da2","proof_of_address":"5607ca8f7e7520c85040c4f45f8a9a6f7275db55f4ef8ec62572b0111f5ae44d","onfido_report":{"result":"clear","breakdown":{"visual_authenticity":{"result":"clear","breakdown":{"other":{"result":"clear"},"face_detection":{"result":"clear"}}},"data_consistency":{"result":"clear","breakdown":{"document_type":{"result":"clear"},"nationality":{"result":"clear"},"date_of_expiry":{"result":"clear"},"date_of_birth":{"result":"clear"},"document_numbers":{"result":"clear"},"gender":{"result":"clear"},"last_name":{"result":"clear"},"first_name":{"result":"clear"},"issuing_country":{"result":"clear"}}},"image_integrity":{"result":"clear","breakdown":{"image_quality":{"result":"clear"},"supported_document":{"result":"clear"}}},"police_record":{"result":"clear"},"data_validation":{"result":"clear","breakdown":{"expiry_date":{"result":"clear"},"date_of_birth":{"result":"clear"},"document_expiration":{"result":"clear"},"document_numbers":{"result":"clear"},"gender":{"result":"clear"},"mrz":{"result":"clear"}}},"data_comparison":{"result":"clear","breakdown":{"document_type":{"result":"clear"},"date_of_expiry":{"result":"clear"},"date_of_birth":{"result":"clear"},"document_numbers":{"result":"clear"},"gender":{"result":"clear"},"last_name":{"result":"clear"},"first_name":{"result":"clear"},"issuing_country":{"result":"clear"}}}},"variant":"standard","created_at":"2018-04-16T10:04:06Z","name":"document","sub_result":"clear","status":"complete"}}'
        }
    }
]

// Dummy data
// for (let index = 10; index < 30; index++) {
//     exports.KYCModel.push({
//         userName: `user${index}`,
//         pass: `user${index}`,
//     })

// }