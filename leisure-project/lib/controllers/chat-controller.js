module.exports = ({ userData, chatData }) => {
    return {
        loadPersonalChats(req, res) {
            chatData.getUserPersonalChats(req.user.username)
                .then((chatRooms) => {
                    res.render('chat/personal-chat', { rooms: chatRooms });
                });
        },
        createPersonalChat(req, res) {
            // Your username and the pageUser username
            const participants = [req.user.username, req.body.pageUser];

            return chatData.createChatroom(participants)
                .then((resultChatroom) => {
                    console.log(res);
                    // why does it not redirect
                    res.redirect(`/users/${req.user.username}/chats`);
                });
        },
    };
};
