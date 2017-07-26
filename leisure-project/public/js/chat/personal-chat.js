/* global $, io */
let currentChatId = null;

const getRecentMessages = (currentUser, chatId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/users/' + currentUser + '/chats/' + chatId,
            type: 'GET',
            success: resolve,
            error: reject,
        });
    });
};

$('.chat-btn').click((ev) => {
    const currentUser = $('#username').text();

    currentChatId = $(ev.target).prop('tagName') === 'LI' ?
    $(ev.target).attr('chatId') :
     $(ev.target).parents('.chat-btn').attr('chatId');

    $('.message-container').html('');
    console.log(currentUser);
    console.log(currentChatId);

    getRecentMessages(currentUser, currentChatId)
        .then((messages) => {
            const container = $('<div/>');

            for (let i = 0; i < messages.length; i += 1) {
                const currentMessage = $('<li/>');
                const messageText = messages[i].author + ' said: ' + messages[i].content;

                currentMessage.text(messageText);
                container.append(currentMessage);
            }

            $('.message-container').html(container.html());
        })
        .catch((err) => {
            console.log(err);
        });
});

$(() => {
    const socket = io.connect();
    const currentUsername = $('#username').text();

    socket.on('conneting user', () => {
        socket.emit('connected user', currentUsername);
    });

    $('#replyBtn').click((ev) => {
        const messageText = $('#replyInput').val();

        socket.emit('send message',
            {
                chatId: currentChatId,
                author: currentUsername,
                content: messageText,
            });

        $('#replyInput').val('');
    });

    socket.on('recieve message', (messageObj) => {
        const $messageElement = $('<li/>');
        const $messageAuthor = $('<a/>')
            .text(messageObj.author)
            .attr('href', '/users/' + messageObj.author);

        $messageElement.html($messageAuthor.html() + ' said: ' + messageObj.content);
        $('.message-container').append($messageElement);
    });
});
