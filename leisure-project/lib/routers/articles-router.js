module.exports = ({ app, express, controllers }) => {
    const router = new express.Router();
    const { articlesController } = controllers;

    router
        .get('/', articlesController.loadArticlesPage)
        .get('/add', articlesController.loadArticleAddingPage)
        .get('/categories/:category', articlesController.loadCategoryPage)
        .get('/:id/edit', articlesController.loadArticleEditPage)
        .get('/:id', articlesController.loadDetailsPage)
        .post('/add', articlesController.addArticle)
        .post('/:id/like', articlesController.likeArticle)
        .post('/:id/unlike', articlesController.unlikeArticle)
        .post('/:id/edit', articlesController.editArticle)
        .post('/:id', articlesController.addComment);

    app.use('/articles', router);
};

