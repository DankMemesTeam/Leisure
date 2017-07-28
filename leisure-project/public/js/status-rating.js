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
                } else {
                    $target.html('Like');
                    $target.prev().html(--statusLikes + ' likes.');
                }
            });
    });
});
