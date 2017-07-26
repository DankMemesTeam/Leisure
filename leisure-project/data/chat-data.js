module.exports = (chatroomCollection, validator, models, logger) => {
    const { Chatroom, Message } = models;
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
        getUserPersonalChats(username, chatType) {
            return chatroomCollection
                .find({
                    $and: [
                        { participants: { $in: [username] } },
                        { chatType: chatType },
                    ],
                });
        },
        createChatroom(participants, chatType) {
            const chatroom = new Chatroom(participants, chatType);

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
                    } else {
                        return Promise.resolve(result);
                    }
                });

            // return chatroomCollection.findAndModify(
            //     {
            //         $and: [
            //             { participants: { $all: participants } },
            //             { chatType: chatType },
            //         ],
            //     },
            //     { $setOnInsert: chatroom },
            //     { upsert: true }
            // );
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
