const assert = require('assert');

// Check out validator npm also -> good way to validate stuff
module.exports = (usersCollection) => {
    return {
        getAllUsers() {
            return usersCollection
                .then((collection) => {
                    return collection.find({}, {});
                });
        },
        getUserById(id) {
            return usersCollection
                .then((collection) => {
                    return collection.findOne({ _id: id });
                });
        },
        findUserBy(query) {
            return usersCollection
                .then((collection) => {
                    return collection.findOne(query);
                });
        },
        createUser(userObject) {
            return usersCollection
                .then((collection) => {
                    return collection.insertOne(userObject);
                });
        },
    };
};
