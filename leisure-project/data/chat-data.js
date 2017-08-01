module.exports = (chatroomCollection, { chatValidator }, models, logger) => {
    const { PrivateChat, EventChat, Message } = models;
    const getChatById = (id) => {
        return chatroomCollection.findById(id);
    };

    return {
        getChatRoomById(id) {
            return getChatById(id);
        },
        getRecentMessagesFromChat(chatId) {
            return getChatById(chatId)
                .then((chatroom) => {
                    return chatroom.messages
                        .slice(Math.max(chatroom.messages.length - 50, 0));
                });
        },
        getUserChats(username, chatType) {
            return chatroomCollection
                .find({
                    $and: [
                        { participants: { $in: [username] } },
                        { chatType: chatType },
                    ],
                });
        },
        createPrivateChatroom(participants, chatType) {
            const chatroom = new PrivateChat(participants, chatType);

            if (!chatValidator.isValidPrivateChat(chatroom)) {
                return Promise.reject();
            }

            return chatroomCollection.findOne(
                {
                    $and: [
                        { participants: { $all: participants } },
                        { chatType: chatType },
                    ],
                },
            )
                .then((result) => {
                    if (!result) {
                        return chatroomCollection.insertOne(chatroom);
                    }
                    return Promise.resolve(result);
                });
        },
        createEventChatroom(participants, chatType, chatTitle, iconImage) {
            const chatroom = new EventChat(participants, chatType, chatTitle, iconImage);

            if (!chatValidator.isValidEventChat(chatroom)) {
                return Promise.reject();
            }

            return chatroomCollection.findOne(
                {
                    $and: [
                        { chatTitle: chatTitle },
                        { chatType: chatType },
                    ],
                },
            )
                .then((result) => {
                    if (!result) {
                        return chatroomCollection.insertOne(chatroom);
                    }
                    return Promise.reject('Chat name already exists!');
                });
        },
        addUserToChat(chatTitle, username) {
            return chatroomCollection.findAndModify(
                { chatTitle: chatTitle },
                { $addToSet: { participants: username } }
            );
        },
        addMessageToChat(messageObj) {
            const message = new Message(messageObj.author, messageObj.content);

            if (!chatValidator.isValidMessage(message)) {
                return Promise.reject();
            }

            return chatroomCollection.findAndModify(
                { _id: chatroomCollection.generateId(messageObj.chatId) },
                { $push: { messages: message } }
            );
        },
    };
};
