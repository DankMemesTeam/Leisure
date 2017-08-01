/* globals $, validateString, validateText,
 validateContent, sanitizeStringInput, validateComment, toastr  */

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

const addChat = (postUrl, chatTitle) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: postUrl,
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

const sendComment = (commentText) => {
    const eventId = window.location.href.split('events/')[1];

    const comment = {
        text: commentText,
    };

    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/events/' + eventId,
            type: 'POST',
            dataType: 'json',
            data: comment,
            success: resolve,
            error: reject,
        });
    });
};

const createComment = (comment) => {
    console.log(comment);
    const $li = $('<li></li>');
    $li.addClass('collection-item avatar');

    const $img = $('<img>');
    $img.addClass('circle');
    $img.attr('src', comment.author.profilePic);

    const $a = $('<a></a>');
    $a.addClass('title');
    $a.attr('href', '/users/' + comment.author.username);
    $a.html(comment.author.username);

    const $p = $('<p></p>');
    $p.html(comment.text);

    $li.append($img);
    $li.append($a);
    $li.append($p);

    $('#comments-list').prepend($li);
};

$(() => {
    $('#create-chat-btn').click((ev) => {
        const postUrl = window.location.href + '/chat';
        const $chatTitle = validateString($('#chatTitle').val(), 'Chat title');

        if (!$chatTitle.isValid) {
            return toastr.error($chatTitle.message);
        }

        return addChat(postUrl, $chatTitle.result)
            .then((response) => {
                if (response.errorMessage) {
                    return toastr.error(response.errorMessage);
                }

                $('#chat-adding-container').addClass('hidden');
                return toastr.success('Successfully created chat!');
            })
            .catch((err) => {
                return toastr.error(err);
            });
    });

    $('#join-event-btn').click((ev) => {
        const postUrl = window.location.href + '/participate';

        addPersonToEvent(postUrl)
            .then((data) => {
                if (data.redirecturl) {
                    window.location.replace(data.redirecturl);
                }
            })
            .catch((err) => {
                // add toastr message
                console.log(err);
            });
    });

    $('#send-comment-btn').click((ev) => {
        const commentText = validateComment($('#comment-content').val());

        if (!commentText.isValid) {
            return toastr.error(commentText.message);
        }

        return sendComment(commentText.result)
            .then((response) => {
                if (response.errorMessage) {
                    return toastr.error(response.errorMessage);
                }
                createComment(response.comment);
                return $('#comment-content').val('');
            })
            .catch((err) => {
                return toastr.error(err);
            });
    });

    (() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLong = position.coords.longitude;
                const userLat = position.coords.latitude;

                const eventLong =
                 +document.getElementById('event-long').innerHTML;
                const eventLat =
                 +document.getElementById('event-lat').innerHTML;

                const distance =
                 getDistanceFromLatLonInKm(userLat, userLong,
                     eventLat, eventLong);
                document.getElementById('distance-from-user').innerHTML +=
                 +distance.toFixed(2) + 'km';
            });
        }
    })();
});
