'use strict';
const {TEST_DATABASE_URL} = require('../config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

let authToken;

describe('Auth endpoints', function() {
    const username = 'DealHunter';
    const password = 'Sales123456';
    const firstName = 'Jane';
    const lastName = 'McDonald';
    const favorites = [];

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    beforeEach(function() {
        return User.hashPassword(password).then(password =>
            User.create({
                username,
                password,
                firstName,
                lastName
            })
        );
    });

    afterEach(function() {
        return User.remove({});
    });

    describe('/api/auth/login', function() {
        it('Should reject requests with no credentials', function () {
            return chai
                .request(app)
                .post('/api/auth/login')
                .then((res) => {
                    return expect(res).to.have.status(400);
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }
                });
        });
        it('Should reject requests with incorrect usernames', function() {
            return chai
                .request(app)
                .post('/api/auth/login')
                .send({ username: 'wrongUsername', password })        
                .then((res) => {
                    return expect(res).to.have.status(401);
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }
                });
        });
        it('Should reject requests with incorrect passwords', function() {
            return chai
                .request(app)
                .post('/api/auth/login')
                .send({ username, password: 'wrongPassword' })
                .then((res) => {
                    return expect(res).to.have.status(401);
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }
                });
        });
        it('Should return a valid auth token', function() {
            return chai
                .request(app)
                .post('/api/auth/login')
                .send({ username, password })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    const token = res.body.authToken;
                    expect(token).to.be.a('string');
                    const payload = jwt.verify(token, JWT_SECRET, {
                        algorithm: ['HS256']
                    });
                    expect({username: payload.user.username}).to.deep.equal({
                        username
                    });
                    expect({firstName: payload.user.firstName}).to.deep.equal({
                        firstName
                    });
                    expect({lastName: payload.user.lastName}).to.deep.equal({
                        lastName
                    });
                    expect({favorites: payload.user.favorites}).to.deep.equal({
                        favorites
                    });
                });
        });
    });

    describe('/api/auth/refresh', function() {
        it('Should reject requests with no credentials', function() {
            return chai
                .request(app)
                .post('/api/auth/refresh')
                .then((res) => {
                    return expect(res).to.have.status(401);
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }
                });
        });
        it('Should reject requests with an invalid token', function() {
            const token = jwt.sign(
                {
                    username,
                    firstName,
                    lastName
                },
                'wrongSecret',
                {
                    algorithm: 'HS256',
                    expiresIn: '7d'
                }
            );

            return chai
                .request(app)
                .post('/api/auth/refresh')
                .set('Authorization', `Bearer ${token}`)
                .then((res) => {
                    return expect(res).to.have.status(401);
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }
                    const res = err.response;
                });
        });
        it('Should reject requests with an expired token', function() {
            const token = jwt.sign(
                {
                    user: {
                        username,
                        firstName,
                        lastName
                    },
                    exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username
                }
            );

            return chai
                .request(app)
                .post('/api/auth/refresh')
                .set('authorization', `Bearer ${token}`)
                .then((res) => {
                    return expect(res).to.have.status(401);
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }
                    const res = err.response;
                });
        });
        it('Should return a valid auth token with a newer expiry date', function() {
            const token = jwt.sign(
                {
                    user: {
                        username,
                        firstName,
                        lastName
                    }
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            const decoded = jwt.decode(token);

            return chai
                .request(app)
                .post('/api/auth/refresh')
                .set('authorization', `Bearer ${token}`)
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    const token = res.body.authToken;
                    expect(token).to.be.a('string');
                    const payload = jwt.verify(token, JWT_SECRET, {
                        algorithm: ['HS256']
                    });
                    expect(payload.user).to.deep.equal({
                        username,
                        firstName,
                        lastName
                    });
                    expect(payload.exp).to.be.at.least(decoded.exp);
                });
        });
    });
});