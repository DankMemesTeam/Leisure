const { ObjectId } = require('mongodb');

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
                    // Add database-level validations here

                    const user = new User(
                        userObject.username,
                        userObject.firstName,
                        userObject.lastName,
                        userObject.email,
                        userObject.hashedPassword);

                    return collection.insertOne(user);
                })
                .catch((err) => {
                    logger.error(err);
                });
        },
        createPost(postObject) {
            return usersCollection
                .then((collection) => {
                    postObject.id = collection.generateId();

                    return collection.findAndModify(
                        { username: postObject.author },
                        { $addToSet: { posts: postObject } }
                    );
                })
                .catch((err) => {
                    logger.error(err);
                });
        },
        editUser(username, data) {
            return usersCollection
                .then((collection) => {
                    return collection.findAndModify(
                        { username: username },
                        { $set: data },
                    );
                })
                .catch((err) => {
                    logger.error(err);
                });
        },
        addPostComment(postAuthor, postId, comment) {
            // Not sure if that`s the best way
            return usersCollection
                .then((collection) => {
                    return collection.findOne({ username: postAuthor });
                })
                .then((foundUser) => {
                    const posts = foundUser.posts || [];

                    const postToComment = posts.find((post) => {
                        return typeof(post.id) === 'object' &&
                            post.id.equals(postId);
                    });

                    const postComments = postToComment.comments || [];
                    postToComment.comments = postComments;
                    postComments.push(comment);

                    return usersCollection
                        .then((collection) => {
                            return collection.findAndModify(
                                { username: postAuthor },
                                { $set: { posts: posts } },
                            )
                        });
                });
        }
    };
};
