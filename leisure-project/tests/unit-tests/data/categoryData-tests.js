// (articleCollection, { articleValidator }, models, logger, { article })
const categoryData = require('../../../data/category-data');
// const model = require('../../../lib/models')().Category;

const { expect } = require('chai');
const sinon = require('sinon');

describe('CategoryData tests', () => {
    let collection = null;
    let validators = null;
    let models = null;
    let logger = null;
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
        };

        config = {
            article: {
                defaultPageSize: 2,
            },
        };


        data = categoryData(collection, validators, models, logger, config);
        // sinon.stub(model, 'constructor');
    });

    afterEach(() => {
        // sinon.restore(model.Article);

        collection = null;
        validators = null;
        models = null;
        config = null;
        data = null;
    });


    it('addCategory should call collection.insertOne  once', (done) => {
        data.addCategory('cat name')
            .then(() => {
                expect(collection.insertOne.callCount).to.eql(1);
                done();
            });
    });
    it('addArticleToCategory should call collection.findAndModify once', (done) => {
        data.addArticleToCategory({}, 'cat name')
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                done();
            });
    });
    it('addArticleToCategory should call collection.findAndModify once', (done) => {
        data.addArticleToCategory({ title: 'title' }, 'cat name')
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                done();
            });
    });
    it('removeArticleFromCategory should call collection.findAndModify and collection.generateId twice', (done) => {
        data.removeArticleFromCategory(5)
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                expect(collection.generateId.callCount).to.eql(2);
                done();
            });
    });
    it('updateCategoryArticle should call collection.findAndModify', (done) => {
        data.updateCategoryArticle(5, { update: 'cat' })
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                done();
            });
    });
    it('getAllCategoryNames should call collection.find once', (done) => {
        data.getAllCategoryNames()
            .then(() => {
                expect(collection.find.callCount).to.eql(1);
                done();
            });
    });
    it('getCategoryArticles should call collection.findOne and collection.count once', (done) => {
        data.getCategoryArticles('cat name')
            .then(() => {
                expect(collection.findOne.callCount).to.eql(1);
                done();
            });
    });
});
