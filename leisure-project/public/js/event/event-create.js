/* globals $ */
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


