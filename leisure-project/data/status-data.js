module.exports = (statusCollection, validator, models, logger) => {
    const { Status } = models;

    return {
        findStatusesByUser(username) {
            return statusCollection.find(
                {
                    'author.username': username,
                },
            );
        },
        createStatus(statusObject) {
            const status = new Status(
                statusObject.author,
                statusObject.content,
                statusObject.imageUrl
            );

            return statusCollection.insertOne(status);
        },
        addStatusComment(statusAuthor, statusId, comment) {
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

            return Promise.all([
                statusCollection.findPaged(query, pageNumber, pageSize),
                statusCollection.count(query),
            ]);

            // return statusCollection.findPaged(query, pageNumber, pageSize);

            // return statusCollection.find(
            //     { 'author.username': { $in: followedUsernames } },
            // );

            
            // toArray() ?
            // SORT ME
        },
    };
};
