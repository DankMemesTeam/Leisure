// (articleCollection, { articleValidator }, models, logger, { article })
const articleData = require('../../../data/article-data');
const model = require('../../../lib/models')().Article;

const { expect } = require('chai');
const sinon = require('sinon');

describe('ArticleData tests', () => {
    let collection = null;
    let validators = null;
    let models = null;
    let logger = null;
    let config = null;
    let data = null;

    beforeEach(() => {
        collection = {
            updateMany: sinon.stub().returns(Promise.resolve()),
            insertOne: sinon.stub().returns(Promise.resolve()),
            generateId: sinon.stub().returns(Promise.resolve()),
            findAndModify: sinon.stub().returns(Promise.resolve()),
            deleteOne: sinon.stub().returns(Promise.resolve()),
            findPaged: sinon.stub().returns(Promise.resolve()),
            count: sinon.stub().returns(Promise.resolve()),
            findById: sinon.stub().returns(Promise.resolve()),
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

        models = {
            Article: model,
        };

        data = articleData(collection, validators, models, logger, config);
        // sinon.stub(model, 'constructor');
    });

    afterEach(() => {
        // sinon.restore(model.Article);

        collection = null;
        validators = null;
        models = null;
        config = null;
        data = null;
    })


    it('updateArticleFields should call collection.updateMany once', (done) => {
        data.updateArticleFields('aaa', { username: 'new' })
            .then(() => {
                expect(collection.updateMany.callCount).to.eql(1);
                done();
            });
    });
    it('editArticle should call collection.findAndModify once', (done) => {
        data.editArticle(1, 'Title', 'Description', 'Content')
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                done();
            });
    });
    it('removeArticle should call collection.deleteOne once', (done) => {
        data.removeArticle(42)
            .then(() => {
                expect(collection.deleteOne.callCount).to.eql(1);
                done();
            });
    });
    it('getAllArticles should call collection.findPaged and collection.count once', (done) => {
        data.getAllArticles(5)
            .then(() => {
                expect(collection.findPaged.callCount).to.eql(1);
                expect(collection.count.callCount).to.eql(1);
                done();
            });
    });
    it('findArticles should call collection.findPaged and collection.count once', (done) => {
        data.findArticles({ q: 'some query' }, 5)
            .then(() => {
                expect(collection.findPaged.callCount).to.eql(1);
                expect(collection.count.callCount).to.eql(1);
                done();
            });
    });
    it('getArticleById should call collection.findById once', (done) => {
        data.getArticleById(5)
            .then(() => {
                expect(collection.findById.callCount).to.eql(1);
                done();
            });
    });
    it('addCommentToArticle should call collection.findAndModify and collection.count once', (done) => {
        data.addCommentToArticle(5, { author: 'sad', text: 'wow' })
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                done();
            });
    });
    it('likeArticle should call collection.findAndModify and collection.count once', (done) => {
        data.likeArticle(5, 'asdasdasd')
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                done();
            });
    });
    it('unlikeArticle should call collection.findAndModify and collection.count once', (done) => {
        data.unlikeArticle(5, 'asdasdasd')
            .then(() => {
                expect(collection.findAndModify.callCount).to.eql(1);
                done();
            });
    });
});
