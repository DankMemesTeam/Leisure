module.exports = (statusCollection, { statusValidator }, models, logger) => {
    const { Status } = models;

    return {
        updateStatusFields(username, updateData) {
            const statusAuthorQuery = { 'author.username': username };

            return statusCollection.updateMany(statusAuthorQuery, {
                $set: { author: updateData },
            });
        },
        findStatusesByUser(username, pageNumber, pageSize) {
            const query = { 'author.username': username };
            const sort = { dateCreated: -1 };

            return Promise.all([
                statusCollection.findPaged(query, {}, pageNumber, pageSize, sort),
                statusCollection.count(query),
            ]);
        },
        createStatus(statusObject) {
            const status = new Status(
                statusObject.author,
                statusObject.content,
                statusObject.imageUrl
            );

            if (!statusValidator.isValid(status)) {
                return Promise.reject();
            }

            return statusCollection.insertOne(status);
        },
        addStatusComment(statusAuthor, statusId, comment) {
            if (!statusValidator.isValidStatusComment(statusAuthor, statusId, comment)) {
                return Promise.reject();
            }

            return statusCollection.findAndModify({
                _id: statusCollection.generateId(statusId),
            },
                {
                    $addToSet: { comments: comment },
                });
        },
        likeStatus(statusAuthor, statusId, likerUsername) {
            return statusCollection.findAndModify({
                _id: statusCollection.generateId(statusId),
            },
                { $addToSet: { likes: likerUsername } }
            );
        },
        dislikeStatus(statusAuthor, statusId, likerUsername) {
            return statusCollection.findAndModify({
                _id: statusCollection.generateId(statusId),
            },
                { $pull: { likes: likerUsername } }
            );
        },
        getFeed(followedUsernames, pageNumber, pageSize) {
            const query = { 'author.username': { $in: followedUsernames } };
            const sort = { dateCreated: -1 };

            return Promise.all([
                statusCollection.findPaged(query, {}, pageNumber, pageSize, sort),
                statusCollection.count(query),
            ]);
        },
    };
};
