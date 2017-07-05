module.exports = (usersCollection) => {
    return {
        getAllUsers() {
            return new Promise((resolve, reject) => {
                usersCollection.find({})
                    .then((users) => {
                        resolve(users);
                    });
            });
        },
    };
};
