/* globals $ */

console.log('Image uploading loaded.');

const clientId = '9dd341bb27efbfd';
const uploadUrl = 'https://api.imgur.com/3/image';


$(document).ready(function() {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: 0.5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        },
        complete: function() { }, // Callback for Modal close
    });
});

const uploadToApi = (url, client, file) => {
    $('#modal-loading').modal('open');

    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            headers: {
                'Authorization': 'Client-ID ' + client,
            },
            data: file,
            success: resolve,
            error: reject,
            processData: false,
        });
    });
};

const sendImageUrl = (url, key, imageUrl) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                [key]: imageUrl,
            },
            success: resolve,
            error: reject,
        });
    });
};
