module.exports = ({ articleData, categoryData, userData }) => {
    const renderArticlesPage = (res, articles, categories) => {
        return res.render('article/article-page', {
            articles,
            categories,
        });
    };

    return {
        loadArticlesPage(req, res, next) {
            let articlesPromise;

            const pageNumber = req.query.page || 1;


            if (!req.query.query) {
                articlesPromise = articleData.getAllArticles(pageNumber);
            } else {
                articlesPromise = articleData.findArticles(req.query.query, pageNumber);
            }

            return categoryData.initCategories()
                .then(() => {
                    return Promise.all([
                        articlesPromise,
                        categoryData.getAllCategoryNames(),
                    ]);
                })
                .then(([[articles, count, pageSize], categories]) => {
                    return res.render('article/article-page', {
                        articles,
                        categories,
                        pageNumber,
                        pagesCount: Math.ceil(count / pageSize),
                        query: req.query.query,
                    });
                });
        },
        // CURRENTLY BROKEN AF
        loadCategoryPage(req, res, next) {
            return Promise.all([
                // Paging here too
                categoryData.getCategoryArticles(req.params.category),
                categoryData.getAllCategoryNames(),
            ])
                .then(([categoryContent, categories]) => {
                    const foundCategories = categories.find((cat) => {
                        return req.params.category.toLowerCase() ===
                            cat.name.toLowerCase();
                    });

                    if (!foundCategories) {
                        return next(new Error(`Category with name ${req.params.category} does not exist`));
                    }

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
                    return res.render('article/add-article-page', {
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
                    res.json({ redirectUrl: '/articles' });
                })
                .catch(() => {
                    res.json({ errorMessage: 'Oops something went wrong!' });
                });
        },
        loadDetailsPage(req, res, next) {
            return articleData.getArticleById(req.params.id)
                .then((article) => {
                    if (!article) {
                        return next(new Error('Invalid article id'));
                    }

                    return res.render('article/article-details', {
                        article,
                        currentUser: req.user
                            ? req.user.username
                            : null,
                    });
                })
                .catch(() => {
                    return next(new Error('Invalid operation'));
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
                    return res.json(comment);
                })
                .catch(() => {
                    return res.json({ errorMessage: 'Invalid comment!' });
                });
        },
        likeArticle(req, res, next) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            return articleData.likeArticle(req.params.id, req.user.username)
                .then((result) => {
                    if (!result) {
                        return next(new Error('Invalid operation'));
                    }

                    return res.sendStatus(200);
                })
                .catch(() => {
                    return next(new Error('Invalid operation'));
                });
        },
        unlikeArticle(req, res, next) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            return articleData.unlikeArticle(req.params.id, req.user.username)
                .then((result) => {
                    if (!result) {
                        return next(new Error('Invalid operation'));
                    }

                    return res.sendStatus(200);
                })
                .catch(() => {
                    return next(new Error('Invalid operation'));
                });
        },
        loadArticleEditPage(req, res, next) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            return articleData.getArticleById(req.params.id)
                .then((article) => {
                    if (!article) {
                        return next(new Error('Invalid article id'));
                    }

                    if (article.author.username !== req.user.username) {
                        return next(new Error('You are not the article owner'));
                    }

                    return res.render('article/article-edit', {
                        article,
                        currentUser: req.user
                            ? req.user.username
                            : null,
                    });
                })
                .catch((err) => {
                    return next(new Error('Invalid article id'));
                });
        },
        editArticle(req, res, next) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            return articleData.getArticleById(req.params.id)
                .then((article) => {
                    if (!article || article.author.username !== req.user.username) {
                        return next(new Error('Invalid operation'));
                    }

                    return Promise.resolve();
                })
                .then(() => {
                    return articleData.editArticle(req.params.id, req.body.title, req.body.description, req.body.content);
                })
                .then((result) => {
                    const article = {
                        author: result.value.author,
                        _id: req.params.id,
                        title: req.body.title,
                        description: req.body.description,
                        content: req.body.content,
                    };

                    return categoryData.updateCategoryArticle(req.params.id, article);
                })
                .then((result) => {
                    res.json({ redirectUrl: `/articles/${req.params.id}` });
                })
                .catch(() => {
                    return res.json({ errorMessage: 'Oops something went wrong!' });
                });
        },
        removeArticle(req, res, next) {
            if (!req.user) {
                res.redirect('/auth/login');
            }

            return articleData.getArticleById(req.params.id)
                .then((article) => {
                    if (!article || article.author.username !== req.user.username) {
                        return next(new Error('You are not the owner of this article'));
                    }

                    return Promise.resolve();
                })
                .then(() => {
                    return Promise.all([
                        articleData.removeArticle(req.params.id),
                        categoryData.removeArticleFromCategory(req.params.id),
                    ]);
                })
                .then((result) => {
                    return articleData.removeArticle(req.params.id)
                        .then(() => {
                            res.sendStatus(200);
                        });
                });
        },
    };
};
