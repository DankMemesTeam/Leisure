/* globals $ */

console.log('Image uploading loaded.');

const clientId = '9dd341bb27efbfd';
const uploadUrl = 'https://api.imgur.com/3/image';

const uploadToApi = (url, client, file) => {
    // Add progress of uploading
    // xhr: () => {
    //     const xhr = new window.XMLHttpRequest();

    //     // Upload progress
    //     xhr.upload.addEventListener("progress", (evt) => {
    //         if (evt.lengthComputable) {
    //             let percentComplete = evt.loaded / evt.total;
    //             console.log(percentComplete);
    //         }
    //     }, false);

    //     // Download progress
    //     xhr.addEventListener("progress", (evt) => {
    //         if (evt.lengthComputable) {
    //             let percentComplete = evt.loaded / evt.total;
    //             // Do something with download progress
    //             console.log(percentComplete);
    //         }
    //     }, false);

    //     return xhr;
    // }
    
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