/*eslint-disable*/
const clientId = '9dd341bb27efbfd';
const uploadUrl = 'https://api.imgur.com/3/image';

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
