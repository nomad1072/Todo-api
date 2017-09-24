const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// To remove all documents:

Todo.remove({}).then((result) => {
    console.log(result);
});

// Find one and Remove

Todo.findOneAndRemove({_id: ''}).then((result) => {
    console.log(result);
});

// To remove any one
Todo.findByIdAndRemove('id goes here').then((result) => {
    console.log(result);
});
