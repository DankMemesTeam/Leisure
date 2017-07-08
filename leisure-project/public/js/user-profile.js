/* globals $ */

$(() => {
    const maxCharacters = 200;
    $('#charCount').html(maxCharacters + ' remaining');

    $('#postInput').keyup(() => {
        const currentLength = $('#postInput').val().length;
        const remainingLength = maxCharacters - currentLength;

        $('#charCount').html(remainingLength + ' remaining');
    });

    // $('#commentInput').keyup(() => {
    //     const keycode = event.keyCode || event.which;

    //     if (keycode === '13') {
    //         $.post('/user/')
    //     }
    // });
});
