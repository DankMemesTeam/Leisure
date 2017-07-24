module.exports = ({ app, express, controllers }) => {
    const router = new express.Router();
    const { articlesController } = controllers;

    router
        .get('/', articlesController.loadArticlesPage)
        .get('/add', articlesController.loadArticleAddingPage)
        .get('/:id', articlesController.loadDetailsPage)        
        .post('/add', articlesController.addArticle)
        .post('/:id/comments', articlesController.addComment);


    app.use('/articles', router);
};

