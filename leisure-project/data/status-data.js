module.exports = (statusCollection, validator, models, logger) => {
    const { Status } = models;

    return {
        findStatusesByUser(username) {
            return statusCollection.find(
                { author: username }
            );
        },
        createStatus(statusObject) {
            const status = new Status(
                statusObject.author,
                statusObject.content,
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
    };
};
