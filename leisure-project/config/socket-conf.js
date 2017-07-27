module.exports = (app, data, chatController) => {
    const { userData, chatData } = data;

    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    const sockets = [];

    io.on('connection', (socket) => {
        console.log('A user has connected');

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
            console.log('A user has disconnected');
        });
    });

    return server;
};
