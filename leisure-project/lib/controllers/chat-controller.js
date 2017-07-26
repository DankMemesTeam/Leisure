module.exports = ({ userData, chatData }) => {
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
                    res.render('chat/personal-chat', {
                        currentUser: req.user,
                        chatRooms,
                    });
                });
        },
        createPersonalChat(req, res) {
            // Your username and the pageUser username
            const participants = [req.user.username, req.body.pageUser];
            const chatType = 'private';

            return chatData.createChatroom(participants, chatType)
                .then((resultChatroom) => {
                    console.log(resultChatroom);
                    // why does it not redirect
                    res.redirect(`/users/${req.user.username}/chats`);
                });
        },
    };
};
