module.exports = ({ articleData, categoryData }) => {
    const renderArticlesPage = (res, articles, categories) => {
        return res.render('articles-page', {
            articles,
            categories,
        });
    };

    return {
        loadArticlesPage(req, res) {
            let articlesPromise;

            if (!req.query.query) {
                articlesPromise = articleData.getAllArticles();
            } else {
                articlesPromise = articleData.findArticles(req.query.query);
            }

            return Promise.all([
                articlesPromise,
                categoryData.getAllCategoryNames(),
            ])
                .then(([articles, categories]) => {
                    return renderArticlesPage(res, articles, categories);
                });
        },
        loadCategoryPage(req, res) {
            return Promise.all([
                categoryData.getCategoryArticles(req.params.category),
                categoryData.getAllCategoryNames(),
            ])
                .then(([categoryContent, categories]) => {
                    return renderArticlesPage(res,
                        categoryContent.articles,
                        categories);
                });
        },
        loadArticleAddingPage(req, res) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            return categoryData.initCategories()
                .then(() => {
                    return categoryData.getAllCategoryNames();
                })
                .then((names) => {
                    return res.render('add-article-page', {
                        categories: names,
                    });
                });
        },
        addArticle(req, res) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            const articleObj = req.body;
            articleObj.author = req.user.username;
            articleObj.tags = req.body.tags.split(/[ ,]+/);


            return articleData.createArticle(articleObj)
                .then((inserted) => {
                    articleObj._id = inserted.insertedId;
                    return categoryData.addArticleToCategory(articleObj,
                        articleObj.category);
                })
                .then(() => {
                    res.redirect('/articles');
                });
        },
        loadDetailsPage(req, res) {
            return articleData.getArticleById(req.params.id)
                .then((article) => {
                    res.render('article-details', { article });
                });
        },
        addComment(req, res) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            const comment = req.body;
            comment.author = req.user.username;

            return articleData.addCommentToArticle(req.params.id, comment)
                .then(() => {
                    res.redirect(`/articles/${req.params.id}`);
                });
        },
    };
};
