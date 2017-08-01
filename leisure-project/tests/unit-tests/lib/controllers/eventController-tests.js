const { expect } = require('chai');
const sinon = require('sinon');

// ({ userData }, renderer, hashGenerator, validator)
const eventController = require('../../../../lib/controllers/event-controller');

describe('EventController tests', () => {
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
            eventData: {
                getAllEvents: sinon.stub().returns(Promise.resolve([])),
                getEventsBy: sinon.stub().returns(Promise.resolve([])),
                getEventById: sinon.stub().returns(Promise.resolve({
                    creator: 'az',
                })),
            }
        };

        controller = eventController(data, null, hashGenerator);
    });

    afterEach(() => {
        req = null;
        res = null;
        next = null;
        data = null;
        controller = null;
    });

    it('loadEventsPage should call eventData.getAllEvents if theres no query', (done) => {
        controller.loadEventsPage(req, res)
            .then(() => {
                expect(data.eventData.getAllEvents.callCount).to.eql(1);
                done();
            });
    });
    it('loadEventsPage should call eventData.getEventsBy if theres no query', (done) => {
        req.query.query = 'find';
        controller.loadEventsPage(req, res)
            .then(() => {
                expect(data.eventData.getEventsBy.callCount).to.eql(1);
                done();
            });
    });
    it('loadEventsPage should call res.render with correct view', (done) => {
        req.query.query = 'find';
        controller.loadEventsPage(req, res)
            .then(() => {
                expect(res.render.calledWith('event/event-page')).to.be.true;
                done();
            });
    });
    it('loadCreationPage should call res.redirect if user is not logged in', () => {
        req.user = null;
        controller.loadCreationPage(req, res);
        expect(res.redirect.calledWith('/auth/login')).to.be.true;
    });
    it('loadCreationPage should call res.render with the correct view name if user is logged', () => {
        controller.loadCreationPage(req, res)
        expect(res.render.calledWith('event/event-create')).to.be.true;
    });
    it('loadEventDetailsPage should call eventData.getEventById with the correct id', (done) => {
        req.params.eventId = '69';
        controller.loadEventDetailsPage(req, res, next)
            .then(() => {
                expect(data.eventData.getEventById.calledWith('69')).to.be.true;
                done();
            });
    });
    it('loadEventDetailsPage should call next once when no event is found', (done) => {
        req.params.eventId = '69';
        data.eventData.getEventById = sinon.stub().returns(Promise.resolve(null));
        controller.loadEventDetailsPage(req, res, next)
            .then(() => {
                expect(next.callCount).to.eql(1);
                done();
            });
    });
    it('loadEventDetailsPage should call next when data throws', (done) => {
        req.params.eventId = '69';
        data.eventData.getEventById = sinon.stub().returns(Promise.reject(null));
        
        controller.loadEventDetailsPage(req, res, next)
            .then(() => {
                expect(next.callCount).to.eql(1);
                done();
            });
    });
    it('createEvent should call res.json if user is not logged in', () => {
        req.user = null;
        controller.createEvent(req, res);
        expect(res.json.callCount).to.eql(1);
    });
});
