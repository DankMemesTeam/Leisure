/* globals $ */

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

    (() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLong = position.coords.longitude;
                const userLat = position.coords.latitude;

                const eventLong = +document.getElementById('event-long').innerHTML;
                const eventLat = +document.getElementById('event-lat').innerHTML;

                const distance = getDistanceFromLatLonInKm(userLat, userLong, eventLat, eventLong);
                document.getElementById('distance-from-user').innerHTML += +distance.toFixed(2) + 'km';
            });
        }
    })();
});
