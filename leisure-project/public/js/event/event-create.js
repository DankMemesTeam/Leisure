/*eslint-disable*/

const createEvent = (eventObj) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/events',
            type: 'POST',
            dataType: 'json',
            data: eventObj,
            success: resolve,
            error: reject,
        });
    });
};

$(document).ready(() => {
    let hasChat = false;

    $('#event-form :checkbox').change((ev) => {
        if ($('#event-form :checkbox:checked').length > 0) {
            hasChat = true;
            $('#chatTitleContainer').removeClass('hidden');
        } else {
            hasChat = false;
            $('#chatTitleContainer').addClass('hidden');
        }
    });

    $('#create-event-btn').click((ev) => {
        const eventTitle = validateText($('#title').val(), 'Event title');
        const eventDescription =
         validateContent($('#description').val(), 'Event description');
        const address = validateExising($('#event-addr').val(), 'Location');
        const long = validateExising($('#event-long').val(), 'Location');
        const lat = validateExising($('#event-lat').val(), 'Location');
        const chatTitle = validateString($('#chatTitle').val(), 'Chat title');

        if (!eventTitle.isValid) {
            return toastr.error(eventTitle.message);
        }

        if (!eventDescription.isValid) {
            return toastr.error(eventDescription.message);
        }

        if (!address.isValid) {
            return toastr.error(address.message);
        }

        if (!long.isValid) {
            return toastr.error(long.message);
        }

        if (!lat.isValid) {
            return toastr.error(lat.message);
        }

        if (hasChat && !chatTitle.isValid) {
            return toastr.error(chatTitle.message);
        }

        return createEvent({
            title: eventTitle.result,
            description: eventDescription.result,
            address: address.result,
            longitude: long.result,
            latitude: lat.result,
            addChat: hasChat.result,
            chatTitle: chatTitle.result,
        })
            .then((response) => {
                if (response.errorMessage) {
                    return toastr.error(response.errorMessage);
                }

                toastr.success('Successfully created event!');
                return window.location.replace(response.redirectUrl);
            });
    });
});
