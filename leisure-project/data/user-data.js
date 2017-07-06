module.exports = (usersCollection) => {
    return {
        getAllUsers() {
            return usersCollection
                .then((collection) => {
                    return collection.find({});
                });
        },
        getUserById(id) {
            return usersCollection
                .then((collection) => {
                    return collection.findById(id);
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
