const getCollection = (connection, collectionName) => {
    return new Promise((resolve, reject) => {
        connection
            .then((db) => {
                const collection = db.collection(collectionName);

                const find =
                    (query, projection) => {
                        return collection.find(query, projection);
                    };

                const findOne =
                    (query, projection) => {
                        return collection.findOne(query, projection);
                    };

                const findAndModify =
                    (filter, update, options, callback) => {
                        return collection
                            .findOneAndUpdate(filter, update, options, callback);
                    };

                const insertOne =
                    (obj) => {
                        return collection.insertOne(obj);
                    };

                const deleteOne =
                    (query) => {
                        return collection.deleteOne(query);
                    };

                const wrappedCollection = {
                    find: find,
                    findOne: findOne,
                    findAndModify: findAndModify,
                    insertOne: insertOne,
                    deleteOne: deleteOne,
                };

                resolve(wrappedCollection);
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

module.exports = getCollection;
