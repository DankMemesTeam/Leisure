module.exports = (chatroomCollection, validator, models, logger) => {
    const { Chatroom } = models;

    return {
        getUserPersonalChats(username) {
            return chatroomCollection
                .find({
                    $and: [
                        { participants: { $in: [username] } },
                        { participants: { $size: 2 } },
                    ],
                });
        },
        createChatroom(participants) {
            const chatroom = new Chatroom(participants);

            return chatroomCollection.findAndModify(
                {
                    $and: [
                        { participants: { $in: participants } },
                        { participants: { $size: 2 } },
                    ],
                },
                { $setOnInsert: chatroom },
                {
                    upsert: true,
                }
            );
        },
    };
};
