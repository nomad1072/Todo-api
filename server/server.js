var {ObjectID} = require('mongodb');

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

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

// Fetch individual todos Format
// GET todos/todoid

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    // Valid id using isValid
        // 404 - send back empty send

    if(!ObjectID.isValid(id)) {
        console.log('ID not valid');
        res.status(404).send();
    }

    // findById
        // success
            // if todo
            // if no todo
        // error
            // 400 - send empty body back
    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send(JSON.stringify(todo, undefined, 2));
    }, (err) => {
        res.status(400).send();
    }).catch((err) => {
        res.status(404).send();
    });

    //res.send(req.params);
});


module.exports = {app};

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
