module.exports = (validator) => {
    const minUsernameLen = 6;
    const minFirstLastNameLen = 3;

    return {
        isValid(userModel) {
            if (!userModel) {
                return false;
            }

            return validator
            .isValidString(userModel.username, minUsernameLen) &&
                validator
                .isValidString(userModel.firstName, minFirstLastNameLen) &&
                validator
                .isValidString(userModel.lastName, minFirstLastNameLen) &&
                validator
                .isValidString(userModel.hashedPassword) &&
                validator
                .isValidString(userModel.profilePic) &&
                validator
                .isValidEmail(userModel.email);
        },
        isValidEditData(username, data) {
            return true;
        },
        isValidId(id) {
            return validator.isValidMongoId(id);
        },
    };
};
