/* globals $ */

const createEvent = (postUrl) => {
    // return new Promise((resolve, reject) => {
    //     $.ajax({
    //         url,
    //         type: 'POST',
    //         dataType: 'json',
    //         data: comment,
    //         success: resolve,
    //         error: reject,
    //     });
    // });
};

$(document).ready(() => {
    $('#event-form :checkbox').change((ev) => {
        console.log($(ev.target).val());
        if ($('#event-form :checkbox:checked').length > 0) {
            $('#chatTitleContainer').removeClass('hidden');
        } else {
            $('#chatTitleContainer').addClass('hidden');
        }
    });
});


