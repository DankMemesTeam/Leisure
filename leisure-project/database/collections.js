const { ObjectId } = require('mongodb');

const getCollection = (connection, collectionName) => {
    let collection;
    connection.then((db) => {
        collection = db.collection(collectionName);
    });

    // REMOVE ME

    const exposedFind = (query) => {
        return collection.find(query);
    };

    // REMOVE

    const find =
        (query, projection, sort) => {
            return collection.find(query, projection).sort(sort).toArray();
        };

    const findPaged =
        (query, projection, pageNumber, pageSize, sort) => {
            return collection.find(query, projection).sort(sort).skip(pageSize * (pageNumber - 1)).limit(pageSize).toArray();
        };

    const count =
        (query) => {
            return collection.count(query);
        };

    const findOne =
        (query, projection) => {
            return collection.findOne(query, projection);
        };

    const findById =
        (query) => {
            return collection.findOne(new ObjectId(query));
        };

    const updateMany = 
        (query, update) => {
            return collection.update(query, update, { multi: true });
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

    const generateId = (id) => {
        return new ObjectId(id);
    };

    return {
        find,
        findPaged,
        count,
        findOne,
        findById,
        findAndModify,
        insertOne,
        deleteOne,
        generateId,
        updateMany,
        // REMOVE
        exposedFind,
    };


    // return new Promise((resolve, reject) => {
    //     connection
    //         .then((db) => {
    //             const collection = db.collection(collectionName);

    //             const find =
    //                 (query) => {
    //                     return collection.find(query).toArray();
    //                 };

    //             const findOne =
    //                 (query) => {
    //                     return collection.findOne(query);
    //                 };

    //             const findById =
    //                 (query) => {
    //                     return collection.findOne(new ObjectId(query));
    //                 };

    //             const findAndModify =
    //                 (filter, update, options, callback) => {
    //                     return collection
    //                         .findOneAndUpdate(filter,
    //                         update,
    //                         options,
    //                         callback);
    //                 };

    //             const insertOne =
    //                 (obj) => {
    //                     return collection.insertOne(obj);
    //                 };

    //             const deleteOne =
    //                 (query) => {
    //                     return collection.deleteOne(query);
    //                 };

    //             const generateId = (id) => {
    //                 return new ObjectId(id);
    //             };

    //             const wrappedCollection = {
    //                 find: find,
    //                 findOne: findOne,
    //                 findById: findById,
    //                 findAndModify: findAndModify,
    //                 insertOne: insertOne,
    //                 deleteOne: deleteOne,
    //                 generateId: generateId,
    //             };

    //             resolve(wrappedCollection);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // });
};

module.exports = getCollection;
