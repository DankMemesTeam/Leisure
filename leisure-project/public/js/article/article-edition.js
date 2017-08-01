$(document).ready(function() {
    Materialize.updateTextFields();
});

const editArticle = (postUrl, newObj) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: postUrl,
            type: 'POST',
            data: newObj,
            success: resolve,
            error: reject,
        });
    });
};

$('#edit-article-btn').click((ev) => {
    const title = validateText($('#title').val(), 'Title');
    const description = validateText($('#description').val(), 'Description');
    const content = validateContent($('#content').val(), 'Content');

    if (!title.isValid) {
        return toastr.error(title.message);
    }

    if (!description.isValid) {
        return toastr.error(description.message);
    }

    if (!content.isValid) {
        return toastr.error(content.message);
    }

    return editArticle(window.location.href, {
        title: title.result,
        description: description.result,
        content: content.result,
    })
        .then((response) => {
            if (response.errorMessage) {
                return toastr.error(response.errorMessage);
            }

            toastr.success('Successfully edited the article!');
            return window.location.replace(response.redirectUrl);
        })
        .catch((err) => {
            return toastr.error('Bummer!' + err);
        });
});
