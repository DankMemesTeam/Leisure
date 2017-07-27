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

const createMessageBox = (author, content) => {
    const $messageDataName = $('<span/>').addClass('message-data-name');

    const $messageData = $('<div/>')
        .addClass('message-data');

    const $messageContent = $('<div/>')
        .addClass('message');
    const $icon = $('<i/>');

    if ($('#username').text() === author) {
        $messageDataName
        .text('You');

        $icon.addClass('fa fa-circle me');

        $messageData
        .addClass('align-right')
        .append($messageDataName)
        .append($icon);

        $messageContent
        .addClass('me-message float-right');
    } else {
        $messageDataName
        .text(author);

        $icon.addClass('fa fa-circle you');

        $messageData
        .append($messageDataName)
        .append($icon);

        $messageContent
        .addClass('you-message');
    }

    $messageContent.text(content);

    const message = $('<div/>')
        .addClass('clearfix')
        .append($messageData)
        .append($messageContent);

    return message;
};

$('.chat-btn').click((ev) => {
    const currentUser = $('#username').text();

    const currentChat = $(ev.target).prop('tagName') === 'LI' ?
        $(ev.target) :
        $(ev.target).parents('.chat-btn');

    $('#person-name').text(currentChat.find('.chat-title').first().text());

    currentChatId = currentChat.attr('chatId');

    $('.message-container').html('');

    getRecentMessages(currentUser, currentChatId)
        .then((messages) => {
            const container = $('<div/>');

            for (let i = 0; i < messages.length; i += 1) {
                const $message = createMessageBox(messages[i].author, messages[i].content);
                container.append($message);
            }

            $('#chat-details').removeClass('hidden');
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
        const $message = createMessageBox(messageObj.author, messageObj.content);

        $('.message-container').append($message);
    });
});
