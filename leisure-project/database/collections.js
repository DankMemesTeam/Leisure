const { ObjectId } = require('mongodb');

const getCollection = (connection, collectionName) => {
    return new Promise((resolve, reject) => {
        connection
            .then((db) => {
                const collection = db.collection(collectionName);

                const find =
                    (query) => {
                        return collection.find(query).toArray();
                    };

                const findOne =
                    (query) => {
                        return collection.findOne(query);
                    };

                const findById =
                    (query) => {
                        return collection.findOne(new ObjectId(query));
                    };

                const findAndModify =
                    (filter, update, options, callback) => {
                        return collection
                            .findOneAndUpdate(filter,
                            update,
                            options,
                            callback);
                    };

                const insertOne =
                    (obj) => {
                        return collection.insertOne(obj);
                    };

                const deleteOne =
                    (query) => {
                        return collection.deleteOne(query);
                    };

                const generateId = () => {
                    return new ObjectId();
                };

                const wrappedCollection = {
                    find: find,
                    findOne: findOne,
                    findById: findById,
                    findAndModify: findAndModify,
                    insertOne: insertOne,
                    deleteOne: deleteOne,
                    generateId: generateId,
                };

                resolve(wrappedCollection);
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

module.exports = getCollection;
