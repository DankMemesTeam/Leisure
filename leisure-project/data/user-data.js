// const { ObjectId } = require('mongodb');

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
        createPost(postObject) {
            postObject.id = usersCollection.generateId();

            return usersCollection.findAndModify(
                { username: postObject.author },
                { $addToSet: { posts: postObject } }
            );
        },
        editUser(username, data) {
            return usersCollection.findAndModify(
                { username: username },
                { $set: data },
            );
        },
        addPostComment(postAuthor, postId, comment) {
            return usersCollection.findAndModify({
                // FILTER
                username: postAuthor,
                'posts.id': usersCollection.generateId(postId),
            },
                {
                    // UPDATE
                    $addToSet: {
                        'posts.$.comments': comment,
                    },
                });
        },
        addLike(postAuthor, postId, likerUsername) {
            return usersCollection.findOne({
                username: postAuthor,
                'posts.id': usersCollection.generateId(postId),
                'posts.$.likes': { username: likerUsername },
            })
                .then((result) => {
                    console.log(result);
                    if (result.likes.length === 0) {
                        console.log('ADD LIKE USER DATA   ' + likerUsername);
                        return usersCollection.findAndModify({
                            username: postAuthor,
                            'posts.id': usersCollection.generateId(postId),
                        },
                            { $addToSet: { 'posts.$.likes': { username: likerUsername } } }
                        );
                    } else {
                        console.log('TAKE LIKE USER DATA');
                        return usersCollection.findAndModify({
                            username: postAuthor,
                            'posts.id': usersCollection.generateId(postId),
                        },
                            { $pull: { 'posts.$.likes': { username: likerUsername } } }
                        );
                    }
                });
        },
    };


    // return {
    //     getAllUsers() {
    //         return usersCollection
    //             .then((collection) => {
    //                 return collection.find({});
    //             });
    //     },
    //     getUserById(id) {
    //         return usersCollection
    //             .then((collection) => {
    //                 return collection.findById(id);
    //             });
    //     },
    //     findUserBy(query) {
    //         return usersCollection
    //             .then((collection) => {
    //                 return collection.findOne(query);
    //             });
    //     },
    //     createUser(userObject) {
    //         return usersCollection
    //             .then((collection) => {
    //                 // Add database-level validations here

    //                 const user = new User(
    //                     userObject.username,
    //                     userObject.firstName,
    //                     userObject.lastName,
    //                     userObject.email,
    //                     userObject.hashedPassword);

    //                 return collection.insertOne(user);
    //             })
    //             .catch((err) => {
    //                 logger.error(err);
    //             });
    //     },
    //     createPost(postObject) {
    //         return usersCollection
    //             .then((collection) => {
    //                 postObject.id = collection.generateId();

    //                 return collection.findAndModify(
    //                     { username: postObject.author },
    //                     { $addToSet: { posts: postObject } }
    //                 );
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //                 logger.error(err);
    //             });
    //     },
    //     editUser(username, data) {
    //         return usersCollection
    //             .then((collection) => {
    //                 return collection.findAndModify(
    //                     { username: username },
    //                     { $set: data },
    //                 );
    //             })
    //             .catch((err) => {
    //                 logger.error(err);
    //             });
    //     },
    //     addPostComment(postAuthor, postId, comment) {
    //         // Not sure if that`s the best way
    //         return usersCollection
    //             .then((collection) => {
    //                 return collection.findAndModify({
    //                     // FILTER
    //                     username: postAuthor,
    //                     'posts.id': collection.generateId(postId),
    //                 },
    //                     {
    //                         // UPDATE
    //                         $addToSet: {
    //                             'posts.$.comments': comment,
    //                         },
    //                     });
    //             });
    //     },
    // };
};
