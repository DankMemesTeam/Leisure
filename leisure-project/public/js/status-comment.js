const sendComment = (commentText, url) => {
    const comment = {
        commentContent: commentText,
    };

    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            type: 'POST',
            dataType: 'json',
            data: comment,
            success: resolve,
            error: reject,
        });
    });
};

const createComment = (comment, $collection) => {
    const $li = $('<li></li>');
    $li.addClass('collection-item');

    const $a = $('<a></a>');
    $a.addClass('comment-username');
    $a.attr('href', '/users/' + comment.author.username);
    $a.html(comment.author.username);

    $li.append($a);
    $li.append('said: ' + comment.content);

    $collection.prepend($li);
};

$(() => {
    $('.comment-form').submit((ev) => {
        ev.preventDefault();

        const commentText = $(ev.target).children('input').val().trim();
        const url = $(ev.target).attr('action');

        sendComment(commentText, url)
            .then((comment) => {
                let $collection = $(ev.target).parent().parent().next().children('ul');

                if ($collection.length === 0) {
                    const $ul = $('<ul></ul>');
                    $ul.addClass('collection');

                    $(ev.target).parent().parent().next().append($ul);
                    $collection = $ul;
                }

                createComment(comment, $collection);
            });
    });
});
