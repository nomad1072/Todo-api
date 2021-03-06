require('./config/config');

const _ = require('lodash');

var {ObjectID} = require('mongodb');

var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


// To create a resource. (Resource creation)
// Send a json object with text property to server
// Server is going to send complete model to client
app.post('/todos', authenticate, (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(404).send(err);
    });
});

// POST /users

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);


    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

// Fetch individual todos Format
// GET todos/todoid

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    // Valid id using isValid
        // 404 - send back empty send

    if(!ObjectID.isValid(id)) {
        console.log('ID not valid');
        res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        res.status(400).send();
    }).catch((err) => {
        res.status(404).send();
    });

});

// Delete route

app.delete('/todos/:id', (req, res) => {
     var id = req.params.id;

     if(!ObjectID.isValid(id)) {
         return res.status(404).send();
     }

     Todo.findByOneAndRemove({
         _id: id,
         _creator: req.user._id
     }).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400).send();
    });

});

// POST /users/login (email, password)

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

// Update Todo items

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send(todo);
    }).catch((err) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((err) => {
        res.status(400).send();
    });
});

module.exports = {app};

app.listen(port, () => {
    console.log(`Started on port ${port}`);
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
