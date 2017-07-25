/* globals $ */

$(() => {
    const likePathExtension = '/like';
    const dislikePathExtension = '/dislike';

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
        let postUrl = $(ev.target).first().parent()
            .children().first().text();
        console.log(postUrl);

        const $target = $(ev.target);

        if ($target.hasClass('liked')) {
            $target.removeClass('liked');
            postUrl = postUrl + '/dislike';
        } else {
            $target.addClass('liked');
            postUrl = postUrl + '/like';
        }

        $.ajax({
            url: postUrl,
            type: 'POST',
            dataType: 'application/json',
            data: {},
            error: (data) => {
                // const $counter = $(ev.target).next();

                // if (postUrl.includes(likePathExtension)) {
                //     $counter.text(+$counter.text() + 1);
                // } else {
                //     $counter.text(+$counter.text() - 1);
                // }
            },
        });
    });
});
