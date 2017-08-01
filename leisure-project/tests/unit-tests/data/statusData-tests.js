/* eslint-disable max-len */

const statusData = require('../../../data/status-data');
const models = require('../../../lib/models').Status;

const { expect } = require('chai');
const sinon = require('sinon');

describe('Status tests', () => {
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
            statusValidator: {
                isValid: sinon.stub().returns(true),
                isValidStatusComment: sinon.stub().returns(true),
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
            Status: models,
        };


        data = statusData(collection, validators, model, logger, config);
    });

    afterEach(() => {
        // sinon.restore(model.Article);

        collection = null;
        validators = null;
        config = null;
        data = null;
    });


    it('updateStatusFields should call collection.updateMany once', (done) => {
        data.updateStatusFields('tosho', { data: 'data' })
            .then(() => {
                expect(collection.updateMany.callCount).to.eql(1);
                done();
            });
    });
    it('findStatusesByUser should call collection.findPaged and collection.count once', (done) => {
        data.findStatusesByUser('tosho', 5, 6)
            .then(() => {
                expect(collection.findPaged.callCount).to.eql(1);
                expect(collection.count.callCount).to.eql(1);
                done();
            });
    });
    it('addStatusComment should call collection.findAndModify and collection.generateId once', (done) => {
        data.addStatusComment('author', 5, { text: 'smth' })
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                expect(collection.generateId.callCount).to.eql(1);
                done();
            });
    });
    it('likeStatus should call collection.findAndModify and collection.generateId once', (done) => {
        data.likeStatus('author', 5, 'liker')
            .then(() => {
                expect(collection.generateId.callCount).to.eql(1);
                expect(collection.findAndModify.callCount).to.eql(1);
                done();
            });
    });
    it('dislikeStatus should call collection.findAndModify and collection.generateId once', (done) => {
        data.dislikeStatus('author', 5, 'unliker')
            .then(() => {
                expect(collection.generateId.callCount).to.eql(1);
                expect(collection.findAndModify.callCount).to.eql(1);
                done();
            });
    });
    it('getFeed should call collection.findPaged and collection.count once', (done) => {
        data.getFeed([], 5, 5)
            .then(() => {
                expect(collection.findPaged.callCount).to.eql(1);
                expect(collection.count.callCount).to.eql(1);
                done();
            });
    });
});
