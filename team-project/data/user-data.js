module.exports = (collection) => {
    return {
        getAllUsers() {
            return new Promise((resolve, reject) => {
                collection.find({})
                    .then((users) => {
                        resolve(users);
                    });
            });
        },
    };
};
