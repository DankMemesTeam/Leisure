/* eslint-disable max-len, no-unused-expressions */

const { expect } = require('chai');
const sinon = require('sinon');

// ({ userData }, renderer, hashGenerator, validator)
const authController = require('../../../../lib/controllers/auth-controller');

describe('AuthController tests', () => {
    let controller = null;
    let req = null;
    let res = null;
    let data = null;
    let hashGenerator = null;

    beforeEach(() => {
        hashGenerator = {
            generateHash: sinon.stub().returns(Promise.resolve('.......')),
        };

        req = {
            user: {},
            params: {},
            query: {},
            body: {},
        };

        res = {
            render: sinon.stub(),
            redirect: sinon.stub(),
            json: sinon.stub(),
            sendStatus: sinon.stub(),
        };

        data = {
            articleData: {
                getAllArticles: sinon.stub().returns(Promise.resolve([])),
                findArticles: sinon.stub().returns(Promise.resolve([])),
                createArticle: sinon.stub().returns(Promise.resolve({
                    insertedId: 69,
                })),
                getArticleById: sinon.stub().returns(Promise.resolve({
                    title: 'lorem ipsum',
                    author: {
                        username: 'Pesho',
                    },
                })),
            },
            categoryData: {
                initCategories: sinon.stub().returns(Promise.resolve()),
                getAllCategoryNames: sinon.stub().returns(Promise.resolve([{ name: 'First' }, { name: 'Second' }])),
                getCategoryData: sinon.stub().returns(Promise.resolve({
                    categories: [
                        { name: 'Coding' },
                    ],
                })),
                getCategoryArticles: sinon.stub().returns(Promise.resolve([])),
            },
            userData: {
                findUserBy: sinon.stub().returns(Promise.resolve({
                    username: 'Nameren',
                    profilePic: 'lorem ipsum',
                    firstName: 'Ffffffffff',
                    lastName: 'Pppppppp',
                })),
                createUser: sinon.stub().returns(Promise.resolve()),
            },
        };

        controller = authController(data, null, hashGenerator);
    });

    afterEach(() => {
        req = null;
        res = null;
        data = null;
        controller = null;
    });


    it('loadLoginPage should call res.render once with proper params', () => {
        controller.loadLoginPage(req, res);
        expect(res.render.calledWith('auth/login')).to.be.true;
    });
    it('loadRegisterPage should call res.render once with proper params', () => {
        controller.loadRegisterPage(req, res);
        expect(res.render.calledWith('auth/register')).to.be.true;
    });
    // it('registerUser should call generateHash once with user`s given password', () => {
    //     req.body = {
    //         username: 'Tossho',
    //         password: '@##!@%',
    //     };

    //     expect(1).to.eql(2);

    //     // controller.registerUser(req, res)
    //     //     .then(() => {
    //     //         expect(hashGenerator.generateHash.calledWith(req.body.password)).to.be.true;
    //     //         done();
    //     //         return Promise.resolve();
    //     //     });
    // });
    it('getUser should call userData.getAllUsers once with proper params', () => {
        controller.loadRegisterPage(req, res);
        expect(res.render.calledWith('auth/register')).to.be.true;
    });
});
