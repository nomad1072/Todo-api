const MongoClient = require('mongodb').MongoClient;
const {MongoCLient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
// Destructuring

// var user = {name: 'Siddharth', age: 20};
// var {name} = user;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('59c5aff524427008647779be')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // })
    // .then((result) => {
    //     console.log(result);
    // });


    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('59c5b0bb2f96f30867c06340')
    }, {
        $set: {
            name: 'doddi'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    })
    .then((result) => {
        console.log(result);
    });

    //db.close();
});
