/* eslint-disable max-len */
const request = require('supertest');
const { expect } = require('chai');

describe('Testing application routes', () => {
    let server = null;
    let db = null;
    let models = null;

    before(() => {
        const validator = require('validator');
        const express = require('express');
        const logger = require('../../config/logger-conf');
        const config = require('../../config/config');
        const connectionString = 'mongodb://localhost:27017/leisureDb-test';
        const app = require('../../config/express-conf')(config, logger);
        const validators = require('../../validators')(validator);
        const hashGenerator = require('../../bin/hash-generator');
        const loadedModels = require('../../lib/models')();
        const dataConfig = require('../../config/data-conf');

        models = loadedModels;

        return require('../../database').connection(connectionString)
            .then((_db) => {
                db = _db;
                const data = require('../../data')(_db, validators, loadedModels, logger, dataConfig);
                const controllers = require('../../lib/controllers')(data, hashGenerator, validators);
                const application = require('../../config/auth-conf')(app, data, _db, config.secretString, hashGenerator);
                const routes = require('../../lib/routers')(application, express, controllers);
                const _server = require('../../config/socket-conf')(application, data, controllers.chatController);

                app.use((err, req, res, next) => {
                    return res.render('page-not-found', { errorMessage: err.message });
                });

                return Promise.resolve(_server);
            })
            .then((s) => {
                server = s;
            });
    });

    describe('HOME ROUTER', () => {
        it('GET /', (done) => {
            request(server)
                .get('/')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
    });

    describe('ARTICLES ROUTER', () => {
        it('GET articles page', (done) => {
            request(server)
                .get('/articles')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('GET articles adding page', (done) => {
            request(server)
                .get('/articles/add')
                .expect(302)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
    });

    describe('AUTH ROUTER', () => {
        it('GET login page', (done) => {
            request(server)
                .get('/auth/login')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('GET register page', (done) => {
            request(server)
                .get('/auth/register')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('GET logout redirect page', (done) => {
            request(server)
                .get('/auth/logout')
                .expect(302)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('POST on login should redirect when passed incorrect params', (done) => {
            request(server)
                .post('/auth/login')
                .send({ username: 'lllevski', password: 'bi4a4os' })
                .expect(302)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('POST on login should return err when passed incorrect params', (done) => {
            request(server)
                .post('/auth/register')
                .send({ username: 'li', firstName: 'm', lastName: 's', email: 'mitko@abg.bg', password: 'bi4a4os' })
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    
                    expect(res.body.errorMessage).to.exist;
                    return done();
                });
        });
    });

    describe('EVENT ROUTER', () => {
        it('GET events page', (done) => {
            request(server)
                .get('/events')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('GET redirect when loading event create page when not logged in', (done) => {
            request(server)
                .get('/events/create')
                .expect(302)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('POST a new event when not logged in', (done) => {
            request(server)
                .post('/events')
                .send({
                    title: 'd', creator: {
                        username: 'dd', profilePic: 'dsf', description: 'dsfdsfdsfsdfsdfdsfsdfsdfsfdfd',
                        participants: ['dd'], chatTitle: 'Boroman', location: 'Sofia',
                    },
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    expect(res.body.redirectUrl).to.eql('/auth/login');
                    return done();
                });
        });
    });

    describe('USER ROUTER', () => {

    });

    after(() => {
        return db.dropDatabase()
            .then(() => {
                db.close();
            });
    });
});
