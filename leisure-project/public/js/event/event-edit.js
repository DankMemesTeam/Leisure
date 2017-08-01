/*eslint-disable*/

$(document).ready(function() {
    $('select').material_select();
});

$('#header-image').change((ev) => {
    const selectedUrl = $('#header-image').val();

    $('.header-image').attr('src', selectedUrl);
});

const editEvent = (postUrl, newEventObj) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: postUrl,
            type: 'POST',
            dataType: 'json',
            data: newEventObj,
            success: resolve,
            error: reject,
        });
    });
};

$('#update-event-btn').click((ev) => {
    const eventTitle = validateText($('#title').val(), 'Event title');
    const eventDescription =
     validateText($('#description').val(), 'Event description');
    const headerImage = $('#header-image option:selected').val();

    if (!eventTitle.isValid) {
        return toastr.error(eventTitle.message);
    }

    if (!eventDescription.isValid) {
        return toastr.error(eventDescription.message);
    }

    return editEvent(window.location.href, {
        title: eventTitle.result,
        description: eventDescription.result,
        headerImage: headerImage,
    })
        .then((response) => {
            if (response.errorMessage) {
                return toastr.error(response.errorMessage);
            }

            toastr.success('Successfully updated event!');
            return window.location.replace(response.redirectUrl);
        });
});
