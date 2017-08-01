/*eslint-disable*/
const tags = [];

$(document).ready(function() {
    $('select').material_select();
});

$('.chips-placeholder').material_chip({
    placeholder: 'Enter a tag',
});

$('.chips').on('chip.add', (ev, chip) => {
    tags.push(chip.tag);
});

$('.chips').on('chip.delete', (ev, chip) => {
    tags.pop(chip.tag);
});

const createArticle = (articleObj) => {
    console.log(articleObj);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/articles/add',
            type: 'POST',
            dataType: 'json',
            data: articleObj,
            success: resolve,
            error: reject,
        });
    });
};

$('#create-article-btn').click((ev) => {
    tags.forEach((x) => {
        x = validateString(x, 'Tag');

        if (!x.isValid) {
            return toastr.error(x.message);
        }
    });

    const title = validateText($('#title').val(), 'Title');
    const description = validateText($('#description').val(), 'Description');
    const content = validateContent($('#article-content').val(), 'Content');
    const category =
     sanitizeStringInput($('#category-select option:selected').text());

    if (!title.isValid) {
        return toastr.error(title.message);
    }

    if (!description.isValid) {
        return toastr.error(description.message);
    }

    if (!content.isValid) {
        return toastr.error(content.message);
    }

    return createArticle({
        title: title.result,
        description: description.result,
        content: content.result,
        category: category,
        tags: tags,
    })
        .then((response) => {
            if (response.errorMessage) {
                return toastr.error(response.errorMessage);
            }

            toastr.success('Successfully created an article!');
            return window.location.replace(response.redirectUrl);
        })
        .catch((err) => {
            return toastr.error('Bummer!' + err.message);
        });
});
