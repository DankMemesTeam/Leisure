module.exports = (app, data, chatController) => {
    const { userData, chatData } = data;

    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    const sockets = [];

    io.on('connection', (socket) => {
        socket.emit('conneting user', {});

        socket.on('connected user', (username) => {
            sockets.push({
                username: username,
                socket: socket,
            });
        });

        socket.on('send message', (messageObj) => {
            Promise.all([chatData.getChatRoomById(messageObj.chatId),
            chatData.addMessageToChat(messageObj)])
                .then((results) => {
                    const currentRoomParticipants = results[0].participants;

                    for (let i = 0; i < sockets.length; i += 1) {
                        if (currentRoomParticipants.includes(sockets[i].username)
                            && results[0]._id.equals(messageObj.chatId)) {
                            if (messageObj.author !== sockets[i].username) {
                                sockets[i].socket.emit('notification');
                            }

                            sockets[i].socket
                                .emit('recieve message', messageObj);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        });

        socket.on('disconnect', () => {
            const index = sockets.findIndex((x) => x.socket === socket);
            sockets.splice(index, 1);
        });
    });

    return server;
};
