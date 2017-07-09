/* globals $ */

$(() => {
    const maxCharacters = 200;
    $('#charCount').html(maxCharacters + ' remaining');

    $('#postInput').keyup(() => {
        const currentLength = $('#postInput').val().length;
        const remainingLength = maxCharacters - currentLength;

        $('#charCount').html(remainingLength + ' remaining');
    });

    $('#like-btn').click(() => {
        const postUrl = $('#comment-form').attr('action');

        return new Promise((resolve, reject) => {
            $.ajax({
                url: postUrl,
                type: 'POST',
                dataType: 'application/json',
                data: { action: 'like' },
                success: resolve,
            });
        });
    });
});
