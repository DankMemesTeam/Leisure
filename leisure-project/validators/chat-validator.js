module.exports = (validator) => {
    const minMessageLen = 2;

    return {
        isValidPrivateChat(chatModel) {
            // type
            if (!chatModel) {
                return false;
            }

            if (!chatModel.participants || chatModel.participants.length !== 2) {
                return false;
            }

            if (!chatModel.chatType || chatModel.chatType !== 'private') {
                return false;
            }

            return true;
        },
        isValidEventChat(chatModel) {
            if (!chatModel) {
                return false;
            }

            if (!chatModel.chatType || chatModel.chatType !== 'event') {
                return false;
            }

            if (!chatModel.title || !validator.isValidString(chatModel.title)) {
                return false;
            }

            if (!chatModel.chatIcon || !validator.isValidString(chatModel.chatIcon)) {
                return false;
            }

            return true;
        },
        isValidMessage(messageModel) {
            if (!messageModel) {
                return false;
            }

            if (!messageModel.author || !validator.isValidString(messageModel.author)) {
                return false;
            }

            if (!messageModel.content || !validator.isValidString(messageModel.content, minMessageLen)) {
                return false;
            }

            return true;
        },
    };
};
