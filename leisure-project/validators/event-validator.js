module.exports = (validator) => {
    const minTitleLen = 5;
    const minDescriptionLen = 5;
    return {
        isValid(eventModel) {
            // .title, .creator, .description, .headerImage, .location.|address|longitude|latitude|mapUrl

            if (!eventModel) {
                return false;
            }

            if (!eventModel.creator) {
                return false;
            }

            if (!eventModel.description || !validator.isValidString(eventModel.description, minDescriptionLen)) {
                return false;
            }

            if (!eventModel.title || !validator.isValidString(eventModel.title, minTitleLen)) {
                return false;
            }

            if (!eventModel.headerImage || !validator.isValidString(eventModel.headerImage)) {
                return false;
            }

            if (!eventModel.location || !eventModel.location.address ||
                !eventModel.location.longitude || !eventModel.location.latitude ||
                !eventModel.location.mapUrl) {
                return false;
            }

            if (!validator.isValidString(eventModel.location.address) ||
                !validator.isValidString(eventModel.location.mapUrl) ||
                isNaN(+eventModel.location.longitude) ||
                isNaN(+eventModel.location.latitude)) {
                return false;
            }

            return true;
        },
        isValidUserAdding(username) {
            return validator.isValidString(username);
        },

        isValidChatAdding(chatTitle) {
            return validator.isValidString(chatTitle);
        },
        isValidEventEdit(title, description, headerImage) {
            return validator.isValidString(title, minTitleLen) &&
                validator.isValidString(description, minDescriptionLen) &&
                validator.isValidString(headerImage);
        },
        isValidId(id) {
            return validator.isValidMongoId(id);
        }
    };
};
