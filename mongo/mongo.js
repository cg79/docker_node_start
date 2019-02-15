const mongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://mongo:27017/polyglot_ninja";

// let db = null;
//
//
// const createMongoConnection = new Promise(function (resolve, reject) {
//     mongoClient.connect(MONGO_URL, (err, database) => {
//         if (err) reject(err);
//
//          db = database.db('mydb');
//         resolve(db);
//     })
// });
//
// const getDb = () => {
//     return db;
// }

// module.exports.createMongoConnection = () => createMongoConnection;
// module.exports.getDb = () => getDb;

class MongoService {
    constructor() {
        this.db = null;
    }

    createMongoConnection() {
        return new Promise((resolve, reject) => {
            console.log(MONGO_URL);
            mongoClient.connect(MONGO_URL, (err, database) => {
                if (err) {console.log(err);  reject(err); }

            this.db = database.db('mydb');
            resolve(this.db);
        })
    })
    }

    getDb(){
        return this.db;
    }


}

module.exports = new MongoService();
