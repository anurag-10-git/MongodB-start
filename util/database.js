 const mongodb = require('mongodb');
 const MongoClient = mongodb.MongoClient;


 const mongoConnect =(callback) => {
    MongoClient.connect('mongodb+srv://anurag:R3DfiPAZnt78pkg8@clusters.nmumkwm.mongodb.net/?retryWrites=true&w=majority').then(client =>{
  console.log('Connected');
  callback(client);
 }).catch(err => {
    console.log(err);
 });
} 
    
module.exports = mongoConnect;