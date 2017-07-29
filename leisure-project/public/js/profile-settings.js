/* globals $ */

const getPostUrl = () => {
    return window.location.href.match(/\/users.*settings/)[0];
};

$('#profile-picture-form').submit((ev) => {
    ev.preventDefault();

    const input = document.getElementById('profile-picture-input');
    const file = input.files[0];

    uploadToApi(uploadUrl, clientId, file)
        .then((response) => {
            const imageUrl = response.data.link;

            const postUrl = getPostUrl();

            return sendImageUrl(postUrl, 'profilePic', imageUrl);
        })
        .then((response) => {
            $('#modal-loading').modal('close');
            $('#modal-done').modal('open');
            console.log(response);

            // if (response.redirect) {
            //     window.location.replace(response.redirect);
            // }
        });
});
