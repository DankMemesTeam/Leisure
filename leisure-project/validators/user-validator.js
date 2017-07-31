module.exports = (validator) => {
    return {
        isValid(userModel) {
            return true;
        },
        isValidEditData(username, data) {
            return true;
        },
    };
};
