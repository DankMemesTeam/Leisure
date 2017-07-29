module.exports = (categoryCollection, validator,
    models, logger, { categories }) => {
    return {
        initCategories() {
            const promises = [];

            return categoryCollection.find({})
                .then((result) => {
                    if (result.length === 0) {
                        for (const cat of categories.initialCategories) {
                            console.log(cat);
                            promises.push(
                                categoryCollection.insertOne({
                                    name: cat,
                                    articles: [],
                                })
                            );
                        }

                        return Promise.all(promises);
                    }

                    return Promise.resolve();
                });
        },
        addCategory(categoryName) {
            // Add model for category?
            const categoryObject = {
                name: categoryName,
                articles: [],
            };

            return categoryCollection.insertOne(categoryObject);
        },
        addArticleToCategory(articleObject, categoryName) {
            const filter = {
                name: categoryName,
            };

            const articleToAdd = {
                _id: articleObject._id,
                title: articleObject.title,
                description: articleObject.description,
                author: articleObject.author,
                category: categoryName,
            };

            const update = {
                $addToSet: {
                    articles: articleToAdd,
                },
            };

            return categoryCollection.findAndModify(filter, update);
        },
        removeArticleFromCategory(articleId) {
            const query = {
                'articles': {
                    $elemMatch: {
                        _id: categoryCollection.generateId(articleId),
                    },
                },
            };

            const update = {
                $pull: {
                    'articles': {
                        _id: categoryCollection.generateId(articleId),
                    },
                },
            };

            return categoryCollection.findAndModify(query, update);
        },
        updateCategoryArticle(id, updateData) {
            const query = {
                'articles._id': categoryCollection.generateId(id),
            };

            const update = {
                $set: {
                    'articles.$.title': updateData.title,
                    'articles.$._id': updateData._id,
                    'articles.$.author': updateData.author,
                    'articles.$.description': updateData.description,
                },
            };

            return categoryCollection.findAndModify(query, update);
        },
        getAllCategoryNames() {
            const query = {};
            const projection = {
                name: 1,
            };
            return categoryCollection.find(query, projection);
        },
        getCategoryArticles(categoryName) {
            const query = {
                name: categoryName,
            };

            return categoryCollection.findOne(query);
        },
    };
};
