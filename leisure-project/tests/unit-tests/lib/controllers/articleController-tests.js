/* eslint-disable max-len, no-unused-expressions */

const { expect } = require('chai');
const sinon = require('sinon');

// ({ articleData, categoryData, userData })
const articleController = require('../../../../lib/controllers/articles-controller');

describe('Article controller tests', () => {
    let controller = null;
    let req = null;
    let res = null;
    let next = null;
    let data = null;

    beforeEach(() => {
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
            },
        };

        controller = articleController(data);
    });

    afterEach(() => {
        req = null;
        res = null;
        next = null;
        data = null;
        controller = null;
    });


    it('loadArticlesPage Should call articleData getAllArticles when no req.query', (done) => {
        controller.loadArticlesPage(req, res, next)
            .then(() => {
                expect(data.articleData.getAllArticles.callCount).to.eql(1);
                done();
            });
    });
    it('loadArticlesPage Should call articleData findArticles when there is req.query', (done) => {
        req.query = {
            query: 'aa',
        };
        controller.loadArticlesPage(req, res, next)
            .then(() => {
                expect(data.articleData.findArticles.callCount).to.eql(1);
                done();
            });
    });
    it('loadArticlesPage Should call articleData initCategories', (done) => {
        controller.loadArticlesPage(req, res, next)
            .then(() => {
                expect(data.categoryData.initCategories.callCount).to.eql(1);
                done();
            });
    });
    it('loadArticlesPage Should call categoryData getCategoryNames', (done) => {
        controller.loadArticlesPage(req, res, next)
            .then(() => {
                expect(data.categoryData.getAllCategoryNames.callCount).to.eql(1);
                done();
            });
    });
    it('loadArticlesPage Should call res.render once', (done) => {
        controller.loadArticlesPage(req, res, next)
            .then(() => {
                expect(res.render.callCount).to.eql(1);
                done();
            });
    });
    it('loadArticlesPage Should call res.render with proper parameters', (done) => {
        controller.loadArticlesPage(req, res, next)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(res.render.args[0].indexOf('article/article-page')).to.not.eql(-1);
                done();
            })
            .catch(() => {
                done(new Error());
            });
    });

    it('loadCategoryPage should call catData.getCategoryArticles once', (done) => {
        req.params.category = 'Smth';

        controller.loadCategoryPage(req, res, next)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(data.categoryData.getCategoryArticles.callCount).to.eql(1);
                done();
            });
    });
    it('loadCategoryPage should call catData.getAllCategoryNames once', (done) => {
        req.params.category = 'Smth';

        controller.loadCategoryPage(req, res, next)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(data.categoryData.getAllCategoryNames.callCount).to.eql(1);
                done();
            });
    });
    it('loadCategoryPage should call next if the category name is not found', (done) => {
        req.params.category = 'Smth';
        controller.loadCategoryPage(req, res, next)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(next.callCount).to.eql(1);
                done();
            });
    });
    it('loadArticleAddingPage should call res.redirect if user is not logged', (done) => {
        req.user = null;
        controller.loadArticleAddingPage(req, res);

        expect(res.redirect.callCount).to.eql(1);
        done();
    });
    it('loadArticleAddingPage should call categoryData.initCategories once', (done) => {
        controller.loadArticleAddingPage(req, res)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(data.categoryData.initCategories.callCount).to.eql(1);
                done();
            });
    });
    it('loadArticleAddingPage should call getAllCategoryNames once', (done) => {
        controller.loadArticleAddingPage(req, res)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(data.categoryData.getAllCategoryNames.callCount).to.eql(1);
                done();
            });
    });
    it('loadArticleAddingPage should call res.render once', (done) => {
        controller.loadArticleAddingPage(req, res)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(res.render.callCount).to.eql(1);
                done();
            });
    });
    it('loadArticleAddingPage should call res.render with proper params', (done) => {
        controller.loadArticleAddingPage(req, res)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(res.render.calledWith('article/add-article-page')).to.be.true;
                done();
            });
    });
    it('addArticle should call res.redirect once when user is not logged', (done) => {
        req.user = null;
        controller.addArticle(req, res);
        expect(res.redirect.callCount).to.eql(1);
        done();
    });
    it('addArticle should call createArticle once', (done) => {
        // req.body.tags = [];
        req.body.tags = '13,144,55';
        controller.addArticle(req, res)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(data.articleData.createArticle.callCount).to.eql(1);
                done();
            });
    });
    it('addArticle should call findUserBy once', (done) => {
        // req.body.tags = [];
        req.body.tags = '13,144,55';

        controller.addArticle(req, res)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(data.userData.findUserBy.callCount).to.eql(1);
                done();
            });
    });
    it('addArticle should call res.json once', (done) => {
        // req.body.tags = [];
        req.body.tags = '13,144,55';

        controller.addArticle(req, res)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(res.json.callCount).to.eql(1);
                done();
            });
    });
    it('loadDetailsPage should call articleData getById with params.id once', (done) => {
        req.params.id = 69;
        controller.loadDetailsPage(req, res, next)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(data.articleData.getArticleById.callCount).to.eql(1);
                done();
            });
    });
    it('loadDetailsPage should call next if no article is found', (done) => {
        req.params.id = 55;
        data.articleData.getArticleById = sinon.stub().returns(Promise.resolve(null));
        controller.loadDetailsPage(req, res, next)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(next.callCount).to.eql(1);
                done();
            });
    });
    it('loadDetailsPage should call res.render if an article is found', (done) => {
        req.params.id = 55;
        controller.loadDetailsPage(req, res, next)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                expect(res.render.callCount).to.eql(1);
                done();
            });
    });
});
