/*eslint-disable*/

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
    const postUrl =
        window.location.href.replace(/.*(\/users\/\w+).*/, '$1/statuses');

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
        const statusText =
            validateText($('#status-text-input').val(), 'Status content');

        if (!statusText.isValid) {
            return toastr.error(statusText.message);
        }

        const image = document.getElementById('status-image-input').files[0];
        const statusData = {
            content: statusText.result,
            imageUrl: null,
        };

        if (image) {
            return uploadToApi(uploadUrl, clientId, image)
                .then((response) => {
                    statusData.imageUrl = response.data.link;
                    return sendStatusData(statusData);
                })
                .then((response) => {
                    if (response.errorMessage) {
                        return toastr.error(response.errorMessage);
                    }

                    $('#modal-loading').modal('close');
                    window.location.replace(window.location.href);
                    
                    // $('#modal-done').modal('open');
                    // document.getElementById('status-image-input').value = '';
                    // document.getElementById('status-text-input').value = '';

                    // $('#profile-page-wall-posts')
                    //     .prepend(response.compiledTemplate);
                });
        } else if (statusText.result.length > 0) {
            return sendStatusData(statusData)
                .then((response) => {
                    if (response.errorMessage) {
                        return toastr.error(response.errorMessage);
                    }

                    $('#modal-loading').modal('close');
                    window.location.replace(window.location.href);
                    
                    // $('#modal-done').modal('open');


                    // document.getElementById('status-image-input').value = '';
                    // document.getElementById('status-text-input').value = '';

                    // $('#modal-loading').modal('close');
                    // $('#modal-done').modal('open');

                    // $('#profile-page-wall-posts')
                    //     .prepend(response.compiledTemplate);
                });
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
                    $btn.html(getIcon('remove_red_eye') + 'Unfollow');
                });
        } else {
            followOrUnfollow('unfollow')
                .then(() => {
                    $btn.html(getIcon('remove_red_eye') + 'Follow');
                });
        }
    });
});
