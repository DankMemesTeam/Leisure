const { expect } = require('chai');
const sinon = require('sinon');

// ({ userData }, renderer, hashGenerator, validator)
const chatController = require('../../../../lib/controllers/chat-controller');

describe('ChatController tests', () => {
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
        };

        controller = chatController(data, null, hashGenerator);
    });

    afterEach(() => {
        req = null;
        res = null;
        next = null;
        data = null;
        controller = null;
    });

    it('getRecentMessages should call chatData.getRecentMessagesFromChat once with valid params', (done) => {
        req.params.chatId = 69;
        controller.getRecentMessages(req, res)
            .then(() => {
                expect(data.chatData.getRecentMessagesFromChat.calledWith(69)).to.be.true;
                done();
            });
    });
    it('getRecentMessages should call userData.removeNotification once with valid params', (done) => {
        req.params.chatId = 69;
        controller.getRecentMessages(req, res)
            .then(() => {
                expect(data.userData.removeNotification.callCount).to.eql(1);
                done();
            });
    });
    it('getRecentMessages should call res.json once', (done) => {
        req.params.chatId = 69;
        controller.getRecentMessages(req, res)
            .then(() => {
                expect(res.json.callCount).to.eql(1);
                done();
            });
    });
    it('getRecentMessages should call chatData.getRecentMessagesFromChat once', (done) => {
        req.params.chatId = 69;
        controller.getRecentMessages(req, res)
            .then(() => {
                expect(data.chatData.getRecentMessagesFromChat.callCount).to.eql(1);
                done();
            });
    });
    it('loadChats should call res.redirect if user is not logged in', () => {
        req.user = null;
        controller.loadChats(req, res);
        expect(res.redirect.calledWith('/auth/login')).to.be.true;
    });
    it('loadChats should call res.redirect with right parameters if requester is not the logged in user', () => {
        req.params.username = 'User1';
        req.user = {
            username: 'User2',
        };

        controller.loadChats(req, res);
        expect(res.redirect.calledWith('/users/User1')).to.be.true;
    });
    it('createPersonalChat should call chatData.createPrivateChatroom once', (done) => {
        req.user.username = 'ASD';
        req.body.pageUser = 'ASD';

        controller.createPersonalChat(req, res)
            .then(() => {
                expect(data.chatData.createPrivateChatroom.callCount).to.eql(1);
                done();
            });
    });
    it('createPersonalChat should call res.json once', (done) => {
        req.user.username = 'ASD';
        req.body.pageUser = 'ASD';

        controller.createPersonalChat(req, res)
            .then(() => {
                expect(res.json.callCount).to.eql(1);
                done();
            });
    });
});
