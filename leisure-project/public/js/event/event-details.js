/* globals $ */

const addChat = (postUrl, chatTitle) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: postUrl + '/chat',
            type: 'POST',
            dataType: 'json',
            data: { chatTitle: chatTitle },
            success: resolve,
            error: reject,
        });
    });
};

const addPersonToEvent = (postUrl) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: postUrl,
            type: 'POST',
            dataType: 'json',
            success: resolve,
            error: reject,
        });
    });
};

$(() => {
    $('#create-chat-btn').click((ev) => {
        const postUrl = window.location.href + '/chat';
        const $chatTitle = $('#chatTitle').val();

        addChat(postUrl, $chatTitle)
            .then((data) => {
                if (data.redirect) {
                    window.location.replace(data.redirect);
                }
            })
            .catch((err) => {
                // add toastr message
                console.log(err);
            });
    });

    $('#join-event-btn').click((ev) => {
        const postUrl = window.location.href + '/participate';

        addPersonToEvent(postUrl)
            .then((data) => {
                if (data.redirect) {
                    window.location.replace(data.redirect);
                }
            })
            .catch((err) => {
                // add toastr message
                console.log(err);
            });
    });
});
