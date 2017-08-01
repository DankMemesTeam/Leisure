/* globals $, validateString, validateText,
 validateContent, sanitizeStringInput, validateComment, toastr  */

const sendComment = (commentText, url) => {
    const comment = {
        commentContent: commentText,
    };

    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
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
    $li.append(' said: ' + comment.content);

    $collection.append($li);
};

$(() => {
    $('.comment-form').submit((ev) => {
        ev.preventDefault();

        const commentText =
         validateComment($(ev.target).children('input').val());
        const url = $(ev.target).attr('action');

        if (!commentText.isValid) {
            return toastr.error(commentText.message);
        }

        const statusId = url.split('/')[3];

        return sendComment(commentText.result, url)
            .then((response) => {
                const comment = response.comment;
                const selector = '#' + statusId + 1;

                let $collection = null;

                if ($(selector).length === 0) {
                    const $ul = $('<ul></ul>');
                    $ul.addClass('collection');

                    $collection = $ul;
                    $(ev.target).parent().parent()
                    .parent().next().children().append($ul);
                } else {
                    $collection = $(selector).children('ul');
                }

                if ($collection.length === 0) {
                    const $ul = $('<ul></ul>');
                    $ul.addClass('collection');

                    $(selector).append($ul);
                    $collection = $ul;
                }

                createComment(comment, $collection);
                $(ev.target).children('input').val('');
            });
    });
});
