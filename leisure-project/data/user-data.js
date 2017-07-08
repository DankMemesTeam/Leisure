module.exports = (usersCollection, validator, models, logger) => {
    const { User } = models;
    // On insert - create user from userObject - validate and then insert
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
                    // validator.validateUserFields(userObject);

                    const user = new User(
                        userObject.username,
                        userObject.firstName,
                        userObject.lastName,
                        userObject.email,
                        userObject.password);

                    return collection.insertOne(user);
                })
                .catch((err) => {
                    logger.error(err);
                });
        },
    };
};
