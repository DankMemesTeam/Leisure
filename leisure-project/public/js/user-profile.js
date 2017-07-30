/* globals $, uploadToApi, uploadUrl, clientId */

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
};
$(() => {
    $('#post-status-btn').click((ev) => {
        const statusText = $('#status-text-input').val();
        const image = document.getElementById('status-image-input').files[0];
        const statusData = {
            content: statusText,
            imageUrl: null,
        };

        if (image) {
            uploadToApi(uploadUrl, clientId, image)
                .then((response) => {
                    statusData.imageUrl = response.data.link;
                    return sendStatusData(statusData);
                })
                .then((response) => {
                    $('#modal-loading').modal('close');
                    $('#modal-done').modal('open');
                    $('#profile-page-wall-posts')
                        .prepend(response.compiledTemplate);
                });
        } else if (statusText.length > 0) {
            sendStatusData(statusData)
                .then((response) => {
                    $('#modal-loading').modal('close');
                    $('#modal-done').modal('open');
                    $('#profile-page-wall-posts')
                        .prepend(response.compiledTemplate);
                });
        }

        $('#status-text-input').val('');
        document.getElementById('status-image-input').value = '';
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
        } else {
            followOrUnfollow('unfollow')
                .then(() => {
                    $btn.html('Follow' + getIcon('remove_red_eye'));
                });
        }
    });
});
