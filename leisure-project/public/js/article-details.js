/* globals $ */

const getIcon = (type) => {
    return '<i class="material-icons right">' + type + '</i>';
};

const request = (type) => {
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
    return Number.parseInt(str.match(/\d+/)[0]);
};

$('#rate-btn').on('click', (ev) => {
    const $target = $('#rate-btn');
    const state = $target.text();

    if (state.indexOf('Unlike') !== -1) {
        request('unlike')
            .then(() => {
                $target.html('Like' + getIcon('thumb_up'));
                let currentCount = getNumberValue($('#likes-count').html());
                $('#likes-count').html(--currentCount + ' likes.');
            });
    }
    else {
        request('like')
            .then(() => {
                $target.html('Unlike' + getIcon('thumb_down'));
                let currentCount = getNumberValue($('#likes-count').html());
                $('#likes-count').html(++currentCount + ' likes.');
            });
    }
});