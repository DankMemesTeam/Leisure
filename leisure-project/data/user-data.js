const assert = require('assert');

// Assert actions should be in a separate validator class
// Check out validator npm also -> good way to validate stuff
module.exports = (usersCollection) => {
    return {
        getAllUsers() {
            return new Promise((resolve, reject) => {
                usersCollection.find({})
                    .then((users) => {
                        resolve(users);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        },
        getUserById(idObj) {
            return new Promise((resolve, reject) => {
                usersCollection.findOne(idObj)
                    .then((user) => {
                        resolve(user);
                    });
            });
        },
        createUser(userObject) {
            return new Promise((resolve, reject) => {
                usersCollection.insertOne(userObject)
                    .then((response, err) => {
                        assert.equal(null, err);
                        // Not tested ... params may be the other way around
                        assert.equal(1, response.insertedCount);

                        resolve();
                    });
            });
        },
    };
};
