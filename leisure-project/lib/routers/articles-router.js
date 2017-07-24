module.exports = ({ app, express, controllers }) => {
    const router = new express.Router();
    const { articlesController } = controllers;

    router.get('/', articlesController.loadArticlesPage);

    app.use('/articles', router);
};

