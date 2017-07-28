module.exports = ({ userData, chatData }) => {
    const getOtherUsersDetails = (chatrooms, currentUser) => {
        const users = [];
        const details = [];

        for (const chat of chatrooms) {
            const otherUserUsername = chat.participants[0] === currentUser
                ? chat.participants[1] : chat.participants[0];

            users.push(userData.findUserBy({ username: otherUserUsername }));
        }

        return Promise.all(users)
            .then((results) => {
                for (let i = 0; i < chatrooms.length; i += 1) {
                    details.push({
                        chatId: chatrooms[i]._id,
                        username: results[i].username,
                        fullName: results[i].firstName + ' ' +
                        results[i].lastName,
                        profilePic: results[i].profilePic,
                        chatRoom: chatrooms[i],
                    });
                }
            })
            .then(() => {
                return details;
            });
    };

    return {
        getRecentMessages(req, res) {
            chatData.getRecentMessagesFromChat(req.params.chatId)
                .then((messages) => {
                    return res.json(messages);
                });
        },
        loadPersonalChats(req, res) {
            chatData.getUserPersonalChats(req.user.username, 'private')
                .then((chatRooms) => {
                    return getOtherUsersDetails(chatRooms, req.user.username);
                })
                .then((chatDetails) => {
                    res.render('chat/personal-chat', {
                        currentUser: req.user,
                        'chatDetails': chatDetails,
                    });
                });
        },
        createPersonalChat(req, res) {
            // Your username and the pageUser username
            const participants = [req.user.username, req.body.pageUser];
            const chatType = 'private';

            return chatData.createChatroom(participants, chatType)
                .then((resultChatroom) => {
                    // res.send(`/users/${req.user.username}/chats`);
                    res.json({ redirect: `/users/${req.user.username}/chats` });
                });
        },
    };
};
