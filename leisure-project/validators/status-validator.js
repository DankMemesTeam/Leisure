module.exports = (validator) => {
    return {
        isValid(statusModel) {
            return true;
        },
        isValidStatusComment(statusAuthor, statusId, comment) {
            return true;
        },
    };
};
