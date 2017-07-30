/* globals $, getNumberValue */

const sendRate = (url) => {
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
    $('.rate-btn').click((ev) => {
        const $target = $(ev.target);
        const $likesText = $target.next().next();
        let postUrl = $target.next().text();

        if ($target.hasClass('liked')) {
            postUrl = postUrl + '/dislike';
        } else {
            postUrl = postUrl + '/like';
        }

        sendRate(postUrl)
            .then(() => {
                let statusLikes = getNumberValue($likesText.html());

                $target.toggleClass('liked');

                if ($target.hasClass('liked')) {
                    $target.html('Unlike');
                    $likesText.html(++statusLikes + ' likes');
                } else {
                    $target.html('Like');
                    $likesText.html(--statusLikes + ' likes');
                }
            });
    });
});
