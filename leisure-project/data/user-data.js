module.exports = (usersCollection, { userValidator }, models, logger) => {
    const { User } = models;
    // On insert - create user from userObject - validate and then insert
    return {
        getAllUsers() {
            return usersCollection.find({});
        },
        getUserById(id) {
            if (!userValidator.isValidId(id)) {
                return Promise.reject();
            }

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

            if (!userValidator.isValid(user)) {
                return Promise.reject();
            }

            return usersCollection.insertOne(user);
        },
        editUser(username, data) {
            if (!userValidator.isValidEditData(username, data)) {
                return Promise.reject();
            }

            return usersCollection.findAndModify(
                { username: username },
                { $set: data }
            );
        },
        getUserFollowed(username) {
            return usersCollection.findOne(
                { username },
                { followed: 1, _id: 0 }
            );
        },
        followUser(follower, userToFollow) {
            // Update follower
            const followerUpdate = usersCollection.findAndModify(
                { username: follower },
                { $addToSet: { followed: userToFollow } }
            );

            // Update user to follow
            const userToFollowUpdate = usersCollection.findAndModify(
                { username: userToFollow },
                { $addToSet: { followers: follower } }
            );

            return Promise.all([
                followerUpdate,
                userToFollowUpdate,
            ]);
        },
        unfollowUser(follower, userToUnfollow) {
            // Update follower
            const followerUpdate = usersCollection.findAndModify(
                { username: follower },
                { $pull: { followed: userToUnfollow } }
            );

            // Update user to unfollow
            const userToUnfollowUpdate = usersCollection.findAndModify(
                { username: userToUnfollow },
                { $pull: { followers: follower } }
            );

            return Promise.all([
                followerUpdate,
                userToUnfollowUpdate,
            ]);
        },
        addNotification(username, chatId) {
            return usersCollection.findAndModify(
                { username: username },
                { $addToSet: { notifications: chatId } },
                { returnOriginal: false }
            );
        },
        removeNotification(username, chatId) {
            return usersCollection.findAndModify(
                { username: username },
                { $pull: { notifications: chatId } },
                {
                    returnOriginal: false,
                }
            );
        },
    };
};
