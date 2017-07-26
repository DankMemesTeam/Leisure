/* globals $ */

const getNumberValue = (str) => {
    return Number.parseInt(str.match(/\d+/)[0], 10);
};

const sendRate = (url) => {
    console.log(url);

    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            success: resolve,
            error: reject,
        });
    });
};

$(() => {
    $('.message-btn').click((ev) => {
        // Should think of better way to do this!
        const url = window.location.href.split('/');
        const username = url[url.length - 1];

        $.ajax({
            url: '/users/' + username + '/chats',
            type: 'POST',
            dataType: 'application/json',
            data: {
                pageUser: username,
            },
        });
    });

    $('.rate-btn').click((ev) => {
        const $target = $(ev.target);

        let postUrl = $target.first().parent()
            .children().first().text();

        if ($target.hasClass('liked')) {
            postUrl = postUrl + '/dislike';
        } else {
            postUrl = postUrl + '/like';
        }

        sendRate(postUrl)
            .then(() => {
                let statusLikes = getNumberValue($target.prev().html());

                $target.toggleClass('liked');

                if ($target.hasClass('liked')) {
                    $target.html('Unlike');
                    $target.prev().html(++statusLikes + ' likes.');
                }
                else {
                    $target.html('Like');
                    $target.prev().html(--statusLikes + ' likes.');
                }
            });
    });
});
