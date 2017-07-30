const isValid = (eventModel) => {
    return true;
};

const isValidUserAdding = (eventId, username) => {
    return true;
};

const isValidChatAdding = (chatId, chatTitle) => {
    return true;
};

const isValidEventEdit = (id, title, description, headerImage) => {
    return true;
};

module.exports = {
    isValid,
    isValidUserAdding,
    isValidChatAdding,
    isValidEventEdit,
};
