module.exports = (validator) => {
    const minContentLen = 4;
    const minCommentLen = 4;

    return {
        isValid(statusModel) {
            if (!statusModel) {
                return false;
            }

            if (!statusModel.author) {
                return false;
            }

            if (!statusModel.author.username ||
                !validator.isValidString(statusModel.author.username)) {
                return false;
            }

            return true;
        },
        isValidStatusComment(statusAuthor, statusId, comment) {
            if (!statusAuthor || !statusId || !comment) {
                return false;
            }

            return validator.isValidString(comment.content, minCommentLen);
        },
    };
};
