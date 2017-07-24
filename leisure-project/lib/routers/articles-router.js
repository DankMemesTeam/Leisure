module.exports = ({ app, express, controllers }) => {
    const router = new express.Router();
    const { articlesController } = controllers;

    router
        .get('/', articlesController.loadArticlesPage)
        .get('/add', articlesController.loadArticleAddingPage)
        .post('/add', articlesController.addArticle)
        .post('/:id/comments', articlesController.addComment)
        .get('/:id', articlesController.loadDetailsPage);


    app.use('/articles', router);
};

