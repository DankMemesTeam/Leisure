/* globals $ */

// selects not rendering otherwise
$(document).ready(() => {
    $('select').material_select();
});

// chips initialization
const tags = [];

$('.chips-placeholder').material_chip({
    placeholder: 'Enter a tag',
});

$('.chips').on('chip.add', (ev, chip) => {
    tags.push(chip.tag);
    console.log(tags.join(','));
});

$('.chips').on('chip.delete', (ev, chip) => {
    tags.pop(chip.tag);
    console.log(tags.join(','));
});

$('#article-submit-form').submit(() => {
    $('<input />').attr('type', 'hidden')
        .attr('name', 'tags')
        .attr('value', tags.join(','))
        .appendTo('#article-submit-form');

    return true;
});
