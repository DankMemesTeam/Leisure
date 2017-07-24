module.exports = (categoryCollection, validator, models, logger) => {
    return {
        initCategories() {
            const categories = [
                'Programming',
                'Science',
                'Math',
                'Other',
            ];

            const promises = [];

            return categoryCollection.find({})
                .then((result) => {
                    if (result.length === 0) {
                        for (const cat of categories) {
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
            };

            const update = {
                $addToSet: {
                    articles: articleToAdd,
                },
            };

            return categoryCollection.findAndModify(filter, update);
        },
        removeArticleFromCategory(articleId, categoryName) {
            // ...
        },
        getAllCategoryNames() {
            const query = {};
            const projection = {
                name: 1,
            }
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
