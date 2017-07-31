module.exports = ({ userData, chatData }) => {
    const getPrivateChatUserDetails = (chatrooms, currentUser) => {
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

    const getEventChatDetails = (chatrooms, currentUser) => {
        const details = [];

        for (let i = 0; i < chatrooms.length; i += 1) {
            details.push({
                chatId: chatrooms[i]._id,
                chatTitle: chatrooms[i].chatTitle,
                chatIcon: chatrooms[i].chatIcon,
                chatRoom: chatrooms[i],
            });
        }

        return details;
    };

    return {
        getRecentMessages(req, res) {
            Promise.all([chatData.getRecentMessagesFromChat(req.params.chatId),
            userData.removeNotification(req.user.username, req.params.chatId)])
                .then((results) => {
                    return res.json({
                        messages: results[0],
                        notificationsLength: results[1].value.notifications.length,
                    });
                });
        },
        loadChats(req, res) {
            if (!req.user) {
                res.redirect('/auth/login');
            } else if (req.user.username !== req.params.username) {
                res.redirect('/users/' + req.params.username);
            }

            Promise.all([chatData.getUserChats(req.user.username, 'private'),
            chatData.getUserChats(req.user.username, 'event')])
                .then((chatRooms) => {
                    return Promise.all([getPrivateChatUserDetails(chatRooms[0], req.user.username),
                    getEventChatDetails(chatRooms[1], req.user.username)]);
                })
                .then((results) => {
                    res.render('chat/chat-page', {
                        currentUser: req.user,
                        privateDetails: results[0],
                        eventDetails: results[1],
                    });
                });
        },
        createPersonalChat(req, res) {
            // Your username and the pageUser username
            const participants = [req.user.username, req.body.pageUser];
            const chatType = 'private';

            return chatData.createPrivateChatroom(participants, chatType)
                .then((resultChatroom) => {
                    res.json({ redirect: `/users/${req.user.username}/chats` });
                })
                .catch(() => {
                    res.json({ errorMessage: 'Invalid personal chat.' });
                });
        },
    };
};
