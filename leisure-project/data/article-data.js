module.exports = (articleCollection, { articleValidator }, models, logger, { article }) => {
    const { Article } = models;

    return {
        updateArticleFields(username, updateData) {
            const articleAuthorQuery = { 'author.username': username };

            return articleCollection.updateMany(articleAuthorQuery, {
                $set: { author: updateData },
            });
        },
        createArticle(articleObject) {
            const articleModel = new Article(
                articleObject.author,
                articleObject.title,
                articleObject.description,
                articleObject.content,
                articleObject.category,
                articleObject.tags,
            );

            if (!articleValidator.isValid(articleModel)) {
                return Promise.reject();
            }

            return articleCollection.insertOne(articleModel);
        },
        editArticle(id, title, description, content) {
            if (!articleValidator.isValidEdit(id, title, description, content)) {
                return Promise.reject();
            }

            const query = {
                _id: articleCollection.generateId(id),
            };

            const update = {
                $set: {
                    title,
                    description,
                    content,
                },
            };

            return articleCollection.findAndModify(query, update);
        },
        removeArticle(id) {
            const query = {
                _id: articleCollection.generateId(id),
            };

            return articleCollection.deleteOne(query);
        },
        getAllArticles(pageNumber) {
            const sort = { dateCreated: - 1 };

            return Promise.all([
                articleCollection.findPaged({}, {}, pageNumber, article.defaultPageSize, sort),
                articleCollection.count({}),
                article.defaultPageSize,
            ]);
        },
        findArticles(query, pageNumber) {
            const sort = { dateCreated: - 1 };

            const search = {
                $or: [
                    { 'author.username': { $in: [query] } },
                    { title: { $in: [query] } },
                    { tags: { $in: [query] } },
                ],
            };

            return Promise.all([
                articleCollection.findPaged(search, {}, pageNumber, article.defaultPageSize, sort),
                articleCollection.count(search),
            ]);
        },
        getArticleById(id) {
            if (!articleValidator.isValidId(id)) {
                return Promise.reject();
            }
            return articleCollection.findById(id);
        },
        addCommentToArticle(articleId, comment) {
            if (!articleValidator.isValidId(articleId)) {
                return Promise.reject();
            }

            if (!articleValidator.isValidComment(articleId, comment)) {
                return Promise.reject();
            }

            const filter = {
                _id: articleCollection.generateId(articleId),
            };

            const update = {
                $addToSet: {
                    comments: comment,
                },
            };

            return articleCollection.findAndModify(filter, update);
        },
        likeArticle(articleId, likerUsername) {
            if (!articleValidator.isValidId(articleId)) {
                return Promise.reject();
            }

            const filter = {
                _id: articleCollection.generateId(articleId),
            };

            const update = {
                $addToSet: {
                    likes: likerUsername,
                },
            };

            return articleCollection.findAndModify(filter, update);
        },
        unlikeArticle(articleId, unlikerUsername) {
            if (!articleValidator.isValidId(articleId)) {
                return Promise.reject();
            }

            const filter = {
                _id: articleCollection.generateId(articleId),
            };

            const update = {
                $pull: {
                    likes: unlikerUsername,
                },
            };

            return articleCollection.findAndModify(filter, update);
        },
    };
};
