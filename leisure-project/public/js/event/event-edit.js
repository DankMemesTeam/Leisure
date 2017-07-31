$(document).ready(function () {
    $('select').material_select();
});

$('#header-image').change((ev) => {


    const selectedUrl = $('#header-image').val();

    $('.header-image').attr('src', selectedUrl);
});
