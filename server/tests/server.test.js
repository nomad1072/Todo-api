const expect = require('expect');
const request = require('supertest');

const {app} = require('./server/server');
const {Todo} = require('./models/todo');
const {ObjectID} = require('mongodb');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 33345
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        done();
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res).toBe(text);
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });
});


describe('GET /todos', () => {
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });

    });
});

describe('GET todos/id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
});

describe('DELETE todos/id', () => {
    it('should delete todo from doc', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todos[0]._id);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if object not found', (done) => {
        request(app)

    });
});

describe('PATCH todos/id', () => {
    it('should update todo from doc', (done) => {
        var id = todos[0]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                completedAt: 3334566
            })
            .expect(200)
            .expect((todo) => {
                expect(res.body.todo._id).toBe(todos[0]._id);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'Some new text, blah';
        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(undefined);
            })
            .end(done);
    });
});
