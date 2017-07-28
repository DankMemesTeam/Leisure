module.exports = (chatroomCollection, validator, models, logger) => {
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
        createEventChatroom(participants, chatType, chatTitle) {
            const chatroom = new EventChat(participants, chatType, chatTitle);

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
                    } else {
                        return Promise.reject('Chat name already exists!');
                    }
                });
        },
        addMessageToChat(messageObj) {
            const message = new Message(messageObj.author, messageObj.content);

            return chatroomCollection.findAndModify(
                { _id: chatroomCollection.generateId(messageObj.chatId) },
                { $push: { messages: message } }
            );
        },
    };
};
