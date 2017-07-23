/* globals $ */
$('.button-collapse').sideNav();

$(() => {
    const maxCharacters = 200;
    const likePathExtension = '/like';
    const dislikePathExtension = '/dislike';

    $('#charCount').html(maxCharacters + ' remaining');

    $('#postInput').keyup(() => {
        const currentLength = $('#postInput').val().length;
        const remainingLength = maxCharacters - currentLength;

        $('#charCount').html(remainingLength + ' remaining');
    });

    $('.rate-btn').click((ev) => {
        // Don't even ask...
        let postUrl = $(ev.target).first().parents('.interactions-container')
            .next().children().first().children().first().attr('action');

        const $target = $(ev.target).parent();

        if ($target.hasClass('liked')) {
            $target.removeClass('liked');
            postUrl = postUrl + '/dislike';
        } else {
            $target.addClass('liked');
            postUrl = postUrl + '/like';
        }

        $.ajax({
            url: postUrl,
            type: 'POST',
            dataType: 'application/json',
            data: {},
            error: (data) => {
                const $counter = $(ev.target).next();

                if (postUrl.includes(likePathExtension)) {
                    $counter.text(+$counter.text() + 1);
                } else {
                    $counter.text(+$counter.text() - 1);
                }
            },
        });
    });
});
