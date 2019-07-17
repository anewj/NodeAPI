const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://anewj:Urusha@19@titantoys-ueepg.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });


module.exports = client;