/*eslint-disable*/

const getIcon = (type) => {
    return '<i class="material-icons right">' + type + '</i>';
};

const sendRating = (type) => {
    const articleId = window.location.href.split('articles/')[1];

    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/articles/' + articleId + '/' + type,
            type: 'POST',
            success: resolve,
            error: reject,
        });
    });
};

const getNumberValue = (str) => {
    return Number.parseInt(str.match(/\d+/)[0], 10);
};

const sendComment = (commentText) => {
    const articleId = window.location.href.split('articles/')[1];

    const comment = {
        text: commentText,
    };

    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/articles/' + articleId,
            type: 'POST',
            dataType: 'json',
            data: comment,
            success: resolve,
            error: reject,
        });
    });
};

const createComment = (comment) => {
    const $li = $('<li></li>');
    $li.addClass('collection-item avatar');

    const $img = $('<img>');
    $img.addClass('circle');
    $img.attr('src', comment.author.profilePic);

    const $a = $('<a></a>');
    $a.addClass('title');
    $a.attr('href', '/users/' + comment.author.username);
    $a.html(comment.author.username);

    const $p = $('<p></p>');
    $p.html(comment.text);

    $li.append($img);
    $li.append($a);
    $li.append($p);

    $('#comments-list').prepend($li);
};

const deleteArticle = (articleId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/articles/' + articleId + '/remove',
            type: 'POST',
            success: resolve,
            error: reject,
        });
    });
};

$('#rate-btn').on('click', (ev) => {
    const $target = $('#rate-btn');
    const state = $target.text();

    if (state.indexOf('Unlike') !== -1) {
        sendRating('unlike')
            .then(() => {
                $target.html('Like' + getIcon('thumb_up'));
                let currentCount = getNumberValue($('#likes-count').html());
                $('#likes-count').html(--currentCount + ' likes.');
            });
    } else {
        sendRating('like')
            .then(() => {
                $target.html('Unlike' + getIcon('thumb_down'));
                let currentCount = getNumberValue($('#likes-count').html());
                $('#likes-count').html(++currentCount + ' likes.');
            });
    }
});

$('#send-comment-btn').on('click', (ev) => {
    const commentText = validateComment($('#comment-content').val());
    if (!commentText.isValid) {
        return toastr.error(commentText.message);
    }

    return sendComment(commentText.result)
        .then((response) => {
            if (response.errorMessage) {
                return toastr.error(response.errorMessage);
            }
            createComment(response.comment);
            return $('#comment-content').val('');
        })
        .catch((err) => {
            return toastr.error(err);
        });
});

$('#article-delete-btn').on('click', (ev) => {
    const articleId =
     window.location.href.replace(/.*articles\/([0-9a-zA-Z]+).*/, '$1');

    deleteArticle(articleId)
        .then(() => {
            window.location.replace('/articles');
            return toastr.success('Successfully deleted article!');
        });
});

