const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://anurag:R3DfiPAZnt78pkg8@clusters.nmumkwm.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("connect");
      _db = client.db(); //this will connect to the shop
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
   if(_db) {
      return _db;
   }
   throw 'No database found';
}

exports.mongoConnect = mongoConnect; //connecting and storing to the database.This will keep on running

exports.getDb = getDb; //this give access to the database if it exists

//mongodb will take care using connection pooling ,it will take care of simultaneous interaction with database 