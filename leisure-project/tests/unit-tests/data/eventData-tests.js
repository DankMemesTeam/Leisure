/* eslint-disable max-len */

const eventData = require('../../../data/event-data');
const models = require('../../../lib/models').Event;

const { expect } = require('chai');
const sinon = require('sinon');

describe('EventData tests', () => {
    let collection = null;
    let validators = null;

    const logger = null;
    let config = null;
    let data = null;

    beforeEach(() => {
        collection = {
            find: sinon.stub().returns(Promise.resolve()),
            updateMany: sinon.stub().returns(Promise.resolve()),
            insertOne: sinon.stub().returns(Promise.resolve()),
            generateId: sinon.stub().returns(Promise.resolve()),
            findAndModify: sinon.stub().returns(Promise.resolve()),
            deleteOne: sinon.stub().returns(Promise.resolve()),
            findPaged: sinon.stub().returns(Promise.resolve()),
            count: sinon.stub().returns(Promise.resolve()),
            findById: sinon.stub().returns(Promise.resolve()),
            findOne: sinon.stub().returns(Promise.resolve()),
        };

        validators = {
            articleValidator: {
                isValid: sinon.stub().returns(true),
                isValidEdit: sinon.stub().returns(true),
                isValidId: sinon.stub().returns(true),
                isValidComment: sinon.stub().returns(true),
            },
            eventValidator: {
                isValid: sinon.stub().returns(true),
                isValidComment: sinon.stub().returns(true),
                isValidId: sinon.stub().returns(true),
                isValidUserAdding: sinon.stub().returns(true),
                isValidChatAdding: sinon.stub().returns(true),
                isValidEventEdit: sinon.stub().returns(true),
            },
        };

        config = {
            article: {
                defaultPageSize: 2,
            },
            event: {
                defaultPageSize: 2,
            },
        };

        const model = {
            Event: models,
        };


        data = eventData(collection, validators, model, logger, config);
    });

    afterEach(() => {
        // sinon.restore(model.Article);

        collection = null;
        validators = null;
        config = null;
        data = null;
    });


    it('getAllEvents should call collection.findPaged and collection.count  once', (done) => {
        data.getAllEvents(5)
            .then(() => {
                expect(collection.findPaged.callCount).to.eql(1);
                expect(collection.count.callCount).to.eql(1);
                done();
            });
    });
    it('getEventById should call collection.findById once', (done) => {
        data.getEventById(4)
            .then(() => {
                expect(collection.findById.callCount).to.eql(1);
                done();
            });
    });
    it('getEventsBy should call collection.findPaged and collection.count once', (done) => {
        data.getEventsBy('title', 5)
            .then(() => {
                expect(collection.findPaged.callCount).to.eql(1);
                expect(collection.count.callCount).to.eql(1);
                done();
            });
    });
    it('addCommentToEvent should call collection.generateId and collection.findAndModify', (done) => {
        data.addCommentToEvent(5, { author: 'asd' })
            .then(() => {
                expect(collection.generateId.callCount).to.eql(1);
                expect(collection.findAndModify.callCount).to.eql(1);
                done();
            });
    });
    it('addUserToEvent should call collection.findAndModify and collection.generateId once', (done) => {
        data.addUserToEvent(5, 'gosho')
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                expect(collection.generateId.callCount).to.eql(1);
                done();
            });
    });
    it('addChatToEvent should call collection.findAndModify and collection.generateId once', (done) => {
        data.addChatToEvent('cat name')
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                expect(collection.generateId.callCount).to.eql(1);
                done();
            });
    });
    it('editEvent should call collection.findAndModify and collection.generateId once', (done) => {
        data.editEvent(5, 'title', 'description', 'img.link')
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                expect(collection.generateId.callCount).to.eql(1);
                done();
            });
    });
});
