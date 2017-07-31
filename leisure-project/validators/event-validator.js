module.exports = (validator) => {
    return {
        isValid(eventModel) {
            return true;
        },
        isValidUserAdding(eventId, username) {
            return true;
        },

        isValidChatAdding(chatId, chatTitle) {
            return true;
        },
        isValidEventEdit(id, title, description, headerImage) {
            return true;
        },
    };
};
