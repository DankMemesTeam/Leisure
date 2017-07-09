/* globals $ */

$(() => {
    const maxCharacters = 200;
    $('#charCount').html(maxCharacters + ' remaining');

    $('#postInput').keyup(() => {
        const currentLength = $('#postInput').val().length;
        const remainingLength = maxCharacters - currentLength;

        $('#charCount').html(remainingLength + ' remaining');
    });

    $('.like-btn').click((ev) => {
        // Don't even ask...
        const postUrl = $(ev.target).first().parents('.interactions-container')
            .next().children().first().children().first().attr('action');

        const $target = $(ev.target).parent();
        console.log($target);
        $.ajax({
            url: postUrl + '/like',
            type: 'POST',
            dataType: 'application/json',
            data: {},
            error: function(data) {
                $target.addClass('dislike-btn');
                $target.removeClass('like-btn');
            },
            success: function(data) {
                console.log('like-nah');
            },
        });
    });

    $('.dislike-btn').click((ev) => {
        // Don't even ask...
        const postUrl = $(ev.target).first().parents('.interactions-container')
            .next().children().first().children().first().attr('action');
        
        const $target = $(ev.target).parent();
        console.log($target);
        $.ajax({
            url: postUrl + '/dislike',
            type: 'POST',
            dataType: 'application/json',
            data: {},
            error: function(data) {
                $target.addClass('like-btn');
                $target.removeClass('dislike-btn');
            },
            success: function(data) {
                console.log('dislike-nah');
            },
        });
    });
});
