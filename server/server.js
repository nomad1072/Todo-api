var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());


// To create a resource. (Resource creation)
// Send a json object with text property to server
// Server is going to send complete model to client
app.post('/todos', (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.send(err);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

// var newUser = new user({
//     email: 'siddharthlanka@gmail.com'
// });
//
// newUser.save().then((doc) => {
//     console.log('Saved to databse Users:', doc);
// }, (err) => {
//     console.log('Unable to save to databse', err);
// });

// var newTodo = new Todo({
//     text: 'Cook Dinner'
// });
//
// var otherTodo = new Todo({
//     text: 'Feed the cat',
//     completed: false,
//     completedAt: 123
// });
// newTodo.save().then((doc) => {
//     console.log('Saved Todo', doc);
// }, (err) => {
//     console.log('Unable to save todo');
// });

// otherTodo.save().then((doc) => {
//     console.log('Saved Todo', doc);
// }, (err) => {
//     console.log('Unable to save to databse');
// });
