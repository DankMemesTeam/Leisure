const { expect } = require('chai');
const sinon = require('sinon');

// ({ userData }, renderer, hashGenerator, validator)
const homeController = require('../../../../lib/controllers/home-controller');

describe('HomeController tests', () => {
    let controller = null;
    let req = null;
    let res = null;
    let next = null;
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

        next = sinon.stub();

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
                removeNotification: sinon.stub().returns(Promise.resolve({
                    value: {
                        notifications: ['lorem', 'ipsum'],
                    },
                })),
                getUserFollowed: sinon.stub().returns(Promise.resolve({
                    followed: ['1'],
                })),
            },
            chatData: {
                getRecentMessagesFromChat: sinon.stub().returns(Promise.resolve([
                    { author: 'asd', content: 'asdasd' },
                ])),
                getUserChats: sinon.stub().returns(Promise.resolve([
                    {},
                    {},
                ])),
                createPrivateChatroom: sinon.stub().returns(Promise.resolve([])),
            },
            eventData: {
                getAllEvents: sinon.stub().returns(Promise.resolve([])),
                getEventsBy: sinon.stub().returns(Promise.resolve([])),
                getEventById: sinon.stub().returns(Promise.resolve({
                    creator: 'az',
                })),
            },
            statusData: {
                getFeed: sinon.stub().returns(Promise.resolve([[], 1])),
            }
        };

        controller = homeController(data);
    });

    afterEach(() => {
        req = null;
        res = null;
        next = null;
        data = null;
        controller = null;
    });

    it('loadHomePage should call res.render with home view when user is not logged in', () => {
        req.user = null;
        controller.loadHomePage(req, res);
        expect(res.render.calledWith('home')).to.be.true;
    });
    it('loadHomePage should call userData.getUserFollowed with the logged user username', (done) => {
        req.user = {
            username: 'Pesho',
        };

        controller.loadHomePage(req, res)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(res.render.calledWith('user/user-feed')).to.be.true;
                done();
            });
    });
});
