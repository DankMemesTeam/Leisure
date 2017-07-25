module.exports = ({ articleData, categoryData, userData }) => {
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
            articleObj.author = {
                username: req.user.username,
            };

            articleObj.tags = req.body.tags.split(/[ ,]+/);

            return Promise.all([
                articleData.createArticle(articleObj),
                userData.findUserBy({ username: req.user.username }),
            ])
                .then(([insertedObject, foundUser]) => {
                    articleObj._id = insertedObject.insertedId;
                    articleObj.author.profilePic = foundUser.profilePic;

                    return categoryData.addArticleToCategory(articleObj, articleObj.category);
                })
                .then(() => {
                    res.redirect('/articles');
                });
        },
        loadDetailsPage(req, res) {
            return articleData.getArticleById(req.params.id)
                .then((article) => {
                    res.render('article-details', {
                        article,
                        currentUser: req.user
                            ? req.user.username
                            : null,
                    });
                });
        },
        addComment(req, res) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            const comment = req.body;
            comment.author = {
                username: req.user.username,
            };

            return userData.findUserBy({ username: req.user.username })
                .then((foundUser) => {
                    comment.author.profilePic = foundUser.profilePic;
                    return articleData.addCommentToArticle(req.params.id, comment);
                })
                .then(() => {
                    console.log('Responding');
                    return res.json(comment);
                });
        },
        likeArticle(req, res) {
            console.log('Like called');
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            return articleData.likeArticle(req.params.id, req.user.username)
                .then(() => {
                    return res.sendStatus(200);
                });
        },
        unlikeArticle(req, res) {
            console.log('Unlike called');

            if (!req.user) {
                return res.redirect('/auth/login');
            }

            return articleData.unlikeArticle(req.params.id, req.user.username)
                .then(() => {
                    return res.sendStatus(200);
                });
        },
    };
};
