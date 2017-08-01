/* eslint-disable max-len, no-unused-expressions */

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

        it('GET articles category page', (done) => {
            request(server)
                .get('/articles/categories/Programming')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('GET articles category page with non existing cat', (done) => {
            request(server)
                .get('/articles/categories/Bazoozle')
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

        it('POST to create article', (done) => {
            request(server)
                .post('/auth/register')
                .send({ username: 'lllevski', firstName: 'Mitko', lastName: 'Stoikov', email: 'mitko@abg.bg', password: 'mitko123' })
                .end((err, res) => {
                    request(server)
                        .post('/auth/login')
                        .send({ username: 'lllevski', password: 'mitko123' })
                        .end((errr, ress) => {
                            request(server)
                                .post('/articles/add')
                                .send({
                                    author: { username: 'lllevski', profilePic: 'iddnu/sadas' },
                                    title: 'Once apon a time story', description: 'Once apon a time there was a wow',
                                    content: 'sdfdsfdsfsdfsdfdsfsdfsddsffsfsdfsfdsfsdfsfd',
                                    category: 'Programming', tags: ['cool'],
                                })
                                .end((errrr, resss) => {
                                    request(server)
                                        .get('/api/getuser')
                                        .end((errrrr, ressss) => {
                                            done();
                                        });
                                });
                        });
                });
        });

        it('POST to create article which is invalid', (done) => {
            let cookie = null;

            request(server)
                .post('/auth/register')
                .send({ username: 'lllevski', firstName: 'Mitko', lastName: 'Stoikov', email: 'mitko@abg.bg', password: 'mitko123' })
                .end((err, res) => {
                    request(server)
                        .post('/auth/login')
                        .send({ username: 'lllevski', password: 'mitko123' })
                        .end((errr, ress) => {
                            cookie = ress.headers['set-cookie'];
                            request(server)
                                .post('/articles/add')
                                .expect(200)
                                .send({
                                    author: { username: 'lllevski', profilePic: 'iddnu/sadas' },
                                    title: '', description: 'Once apon a time there was a wow',
                                    content: 'sdfdsfdsfsdfsdfdsfsdfsddsffsfsdfsfdsfsdfsfd',
                                    category: 'Programming', tags: ['cool'],
                                })
                                .set('cookie', cookie)
                                .end((errrr, resss) => {
                                    console.log(ress.body);
                                    done();
                                });
                        });
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
                    console.log(res.body);

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

        it('POST on login should return userObj when correct', (done) => {
            let cookie = null;

            request(server)
                .post('/auth/register')
                .send({ username: 'lllevski', firstName: 'Mitko', lastName: 'Stoikov', email: 'mitko@abg.bg', password: 'mitko123' })
                .expect(200)
                .end((err, res) => {
                    request(server)
                        .post('/auth/login')
                        .expect(200)
                        .end((errr, ress) => {
                            cookie = res.headers['set-cookie'];
                            request(server)
                                .post('/auth/login')
                                .set('cookie', cookie)
                                .expect(200)
                                .end((errrr, resss) => {
                                    console.log(resss);
                                    done();
                                });
                        });
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
        it('load user profile when there is a existing user with such profile', (done) => {
            request(server)
                .post('/auth/register')
                .send({ username: 'lllevski', firstName: 'Mitko', lastName: 'Stoikov', email: 'mitko@abg.bg', password: 'mitko123' })
                .end((err, res) => {
                    request(server)
                        .get('/users/lllevski')
                        .expect(200)
                        .end((errr, ress) => {
                            done();
                        });
                });
        });

        it('load user profile chats when there is a existing user with such profile', (done) => {
            request(server)
                .post('/auth/register')
                .send({ username: 'lllevski', firstName: 'Mitko', lastName: 'Stoikov', email: 'mitko@abg.bg', password: 'mitko123' })
                .end((err, res) => {
                    request(server)
                        .get('/users/lllevski/chats')
                        .end((errr, ress) => {
                            done();
                        });
                });
        });

        it('load user profile settings when there is a existing user with such profile', (done) => {
            request(server)
                .post('/auth/register')
                .send({ username: 'lllevski', firstName: 'Mitko', lastName: 'Stoikov', email: 'mitko@abg.bg', password: 'mitko123' })
                .end((err, res) => {
                    request(server)
                        .get('/users/lllevski/settings')
                        .end((errr, ress) => {
                            done();
                        });
                });
        });
    });

    after(() => {
        return db.dropDatabase()
            .then(() => {
                db.close();
            });
    });
});
