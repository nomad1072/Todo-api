var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://nomad1072:qwerty@ds147964.mlab.com:47964/todo-api' || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};
