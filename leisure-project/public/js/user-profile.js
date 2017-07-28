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

const sendStatusData = (statusData) => {
    const postUrl = window.location.href.replace(/.*(\/users\/\w+).*/, '$1/statuses');

    return new Promise((resolve, reject) => {
        $.ajax({
            url: postUrl,
            type: 'POST',
            dataType: 'json',
            data: statusData,
            success: resolve,
            error: reject,
        });
    });
}

$(() => {
    $('#publish-status-form').submit((ev) => {
        ev.preventDefault();

        const statusText = $('#status-text-input').val();
        const image = document.getElementById('status-image-input').files[0];

        // console.log(statusText);
        // console.log(image);

        if (image) {
            uploadToApi(uploadUrl, clientId, image)
                .then((response) => {
                    const statusData = {
                        content: statusText,
                        imageUrl: response.data.link,
                    };

                    return sendStatusData(statusData);
                })
                .then((response) => {
                    window.location.replace(response.redirect);
                });
        }
        else if (statusText.length > 0) {
            const statusData = {
                content: statusText,
                imageUrl: null,
            };

            sendStatusData(statusData)
                .then((response) => {
                    window.location.replace(response.redirect);
                });
        }
        else {
            window.location.replace(window.location.href);
        }
    });

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
            success: function (data) {
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
        } else {
            followOrUnfollow('unfollow')
                .then(() => {
                    $btn.html('Follow' + getIcon('remove_red_eye'));
                });
        }
    });

    // $('.comment-form').submit((ev) => {
    //     ev.preventDefault();

    //     const commentText = $(ev.target).children('input').val().trim();
    //     const url = $(ev.target).attr('action');

    //     sendComment(commentText, url)
    //         .then((comment) => {
    //             const $collection = $(ev.target).parent().parent().next().children('ul');
    //             createComment(comment, $collection);
    //             $(ev.target).children('input').val('');
    //         });
    // });
});
