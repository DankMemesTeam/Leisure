/* globals $ */
const followOrUnfollow = (action) => {
    const url = window.location.href;

    const postUrl = url.substr(url.indexOf('/user')) + '/' + action;

    return new Promise((resolve, reject) => {
        $.ajax({
            url: postUrl,
            type: 'POST',
            success: resolve,
            error: reject,
        });
    });
};

<<<<<<< HEAD
=======
const createComment = (comment, $collection) => {
    const $li = $('<li></li>');
    $li.addClass('collection-item');

    const $a = $('<a></a>');
    $a.addClass('comment-username');
    $a.attr('href', '/users/' + comment.author);
    $a.html(comment.author);

    $li.append($a);
    $li.append(' said: ' + comment.content);

    $collection.prepend($li);
};

>>>>>>> chat
$(() => {
    $('.message-btn').click((ev) => {
        // Should think of better way to do this!
        const url = window.location.href.split('/');
        const username = url[url.length - 1];

        $.ajax({
            url: '/users/' + username + '/chats',
            type: 'POST',
            dataType: 'json',
            data: {
                pageUser: username,
            },
            success: function(data) {
                if (data.redirect) {
                    window.location.replace(data.redirect);
                }
            },
        });
    });

    $('#follow-user-btn').click((ev) => {
        const $btn = $('#follow-user-btn');

        $btn.toggleClass('followed');

        if ($btn.hasClass('followed')) {
            followOrUnfollow('follow')
                .then(() => {
                    $btn.html('Unfollow' + getIcon('remove_red_eye'));
                });
        }
        else {
            followOrUnfollow('unfollow')
                .then(() => {
                    $btn.html('Follow' + getIcon('remove_red_eye'));
                });
        }

<<<<<<< HEAD
=======
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

    $('.comment-form').submit((ev) => {
        ev.preventDefault();

        const commentText = $(ev.target).children('input').val().trim();
        const url = $(ev.target).attr('action');

        sendComment(commentText, url)
            .then((comment) => {
                const $collection = $(ev.target).parent().parent().next().children('ul');
                createComment(comment, $collection);
                $(ev.target).children('input').val('');
            });
>>>>>>> chat
    });
});
