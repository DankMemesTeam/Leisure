module.exports = (validator) => {
    return {
        isValidPrivateChat(chatModel) {
            return true;
        },
        isValidEventChat(chatModel) {
            return true;
        },
        isValidMessage(messageModel) {
            return true;
        },
    };
};
