'use strict';
const {TEST_DATABASE_URL} = require('../config');
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/user', function() {
    const username = 'DealHunter';
    const password = 'Sales123456';
    const firstName = 'Jane';
    const lastName = 'McDonald';

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    beforeEach(function() {});

    afterEach(function() {
        return User.remove({});
    });

    describe('/api/users', function() {
        describe('POST', function() {
            it('Should reject users with missing username', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        password,
                        firstName,
                        lastName
                    })
                    .then((obj) => {
                        const res = err.response;
                        return expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Missing field');
                        expect(res.body.location).to.equal('username');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with missing password', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username,
                        firstName,
                        lastName
                    })
                    .then((obj) => {
                        const res = err.response;
                        return expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Missing field');
                        expect(res.body.location).to.equal('password');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with non-string username', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username: 1234,
                        password,
                        firstName,
                        lastName
                    })
                    .then((obj) => {
                        return expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Incorrect field type: expected string');
                        expect(res.body.location).to.equal('username');

                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });            
            });
            it('Should reject users with non-string password', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username,
                        password: 1234,
                        firstName,
                        lastName
                    })
                    .then((obj) => {
                        const res = err.response;
                        return expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Incorrect field type: expected string');
                        expect(res.body.location).to.equal('password');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with non-string first name', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username,
                        password,
                        firstName: 1234,
                        lastName
                    })
                    .then((obj) => {
                        const res = err.response;
                        return  expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Incorrect field type: expected string');
                        expect(res.body.location).to.equal('firstName');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with non-string last name', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username,
                        password,
                        firstName,
                        lastName: 1234
                    })
                    .then((obj) => {
                        const res = err.response;
                        return expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Incorrect field type: expected string');
                        expect(res.body.location).to.equal('lastName');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with non-trimmed username', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username: ` ${username} `,
                        password,
                        firstName,
                        lastName
                    })
                    .then((obj) => {
                        const res = err.response;
                        return expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Cannot start or end with whitespace');
                        expect(res.body.location).to.equal('username');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with non-trimmed password', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username,
                        password: ` ${password} `,
                        firstName,
                        lastName
                    })
                    .then((obj) => {
                        const res = err.response;
                        return expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Cannot start or end with whitespace');
                        expect(res.body.location).to.equal('password');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with empty username', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username: '',
                        password,
                        firstName,
                        lastName
                    })
                    .then((obj) => {
                        const res = err.response;
                        return expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Must be at least 1 characters long');
                        expect(res.body.location).to.equal('username');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with password less than ten characters', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username,
                        password: '123456789',
                        firstName,
                        lastName
                    })
                    .then((obj) => {
                        const res = err.response;
                        return expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Must be at least 10 characters long');
                        expect(res.body.location).to.equal('password');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with password greater than 72 characters', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username,
                        password: new Array(73).fill('a').join(''),
                        firstName,
                        lastName
                    })
                    .then((obj) => {
                        const res = err.response;
                        return  expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Must be at most 72 characters long');
                        expect(res.body.location).to.equal('password');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with duplicate username', function() {
                return User.create({
                    username,
                    password,
                    firstName,
                    lastName
                })
                    .then(() =>
                        chai.request(app).post('/api/users').send({
                            username,
                            password,
                            firstName,
                            lastName
                        })
                    )
                    .then((obj) => {
                        const res = err.response;
                        return expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Username already taken');
                        expect(res.body.location).to.equal('username');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should create a new user', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username,
                        password,
                        firstName,
                        lastName
                    })
                    .then(res => {
                        expect(res).to.have.status(201);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.keys(
                            'id',
                            'username',
                            'firstName',
                            'lastName',
                            'favorites'
                        );
                        expect(res.body.username).to.equal(username);
                        expect(res.body.firstName).to.equal(firstName);
                        expect(res.body.lastName).to.equal(lastName);
                        return User.findOne({
                            username
                        });
                    })
                    .then(user => {
                        expect(user).to.not.be.null;
                        expect(user.firstName).to.equal(firstName);
                        expect(user.lastName).to.equal(lastName);
                        return user.validatePassword(password);
                    })
                    .then(passwordIsCorrect => {
                        expect(passwordIsCorrect).to.be.true;
                    });
            });
            it('Should trim firstName and lastName', function() {
                return chai
                    .request(app)
                    .post('/api/users')
                    .send({
                        username,
                        password,
                        firstName: ` ${firstName} `,
                        lastName: ` ${lastName} `
                    })
                    .then(res => {
                        expect(res).to.have.status(201);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.keys(
                            'id',
                            'username',
                            'firstName',
                            'lastName',
                            'favorites'
                        );
                      expect(res.body.username).to.equal(username);
                      expect(res.body.firstName).to.equal(firstName);
                      expect(res.body.lastName).to.equal(lastName);
                        return User.findOne({
                            username
                        });
                    })
                    .then(user => {
                      expect(user).to.not.be.null;
                      expect(user.firstName).to.equal(firstName);
                      expect(user.lastName).to.equal(lastName);
                    });
            });
        });

        describe('GET', function() {
            it('Should return a single user', function() {
                return User.create(
                    {
                        username,
                        password,
                        firstName,
                        lastName
                    }
                )
                    .then(() => chai.request(app).get('/api/users'))
                    .then(res => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body[0].username).equal(
                            username
                        );
                        expect(res.body[0].firstName).equal(
                            firstName
                        );
                        expect(res.body[0].lastName).equal(
                            lastName
                        );
                    });
            });
        });
    });
});