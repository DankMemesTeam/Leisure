module.exports = (usersCollection, validator, models, logger) => {
    const { User } = models;
    // On insert - create user from userObject - validate and then insert
    return {
        getAllUsers() {
            return usersCollection.find({});
        },
        getUserById(id) {
            return usersCollection.findById(id);
        },
        findUserBy(query) {
            return usersCollection.findOne(query);
        },
        createUser(userObject) {
            const user = new User(
                userObject.username,
                userObject.firstName,
                userObject.lastName,
                userObject.email,
                userObject.hashedPassword);

            return usersCollection.insertOne(user);
        },
        editUser(username, data) {
            return usersCollection.findAndModify(
                { username: username },
                { $set: data },
            );
        },
    };
};
