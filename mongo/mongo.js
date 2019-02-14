const mongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://localhost:27017/polyglot_ninja";

let db = null;


const createMongoConnection = new Promise(function (resolve, reject) {
    mongoClient.connect(MONGO_URL, (err, database) => {
        if (err) reject(err);

        db = database.db('mydb');
        resolve(db);
    })
});

module.exports.createMongoConnection = () => createMongoConnection;
