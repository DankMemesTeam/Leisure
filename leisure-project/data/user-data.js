module.exports = (usersCollection, validator, models) => {
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
            const user = new User(userObject.username, userObject.firstName,
            userObject.lastName, userObject.email, userObject.password);

            return usersCollection
                .then((collection) => {
                    validator.validateUser(user);
                    return collection.insertOne(user);
                })
                .catch((err) => {
                    // shold be logged by the logger
                    console.log(err);
                });
        },
    };
};
