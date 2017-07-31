/* globals $, uploadToApi, uploadUrl, clientId, sendImageUrl */
import $ from 'jquery';
import toastr from 'toastr';
import { validatorModule } from 'validator-module';

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

            input.parentElement.removeChild(input);
        });
});

const updateFirstName = (postUrl, newName) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: postUrl,
            type: 'POST',
            dataType: 'json',
            data: { firstName: newName },
            success: resolve,
            error: reject,
        });
    });
};

$('#update-firstName-btn').click((ev) => {
    const newName = validatorModule.validateName($('#firstName').val(), 'First name');
    const postUrl = window.location.href;

    if (!newName.isValid) {
        return toastr.error(newName.message);
    }

    updateFirstName(postUrl, newName.result)
        .then((response) => {
            if (response.errorMessage) {
                return toastr.error(response.errorMessage);
            }

            toastr.success('Successfully updated first name!');
            $('#firstName').val('');
        });
});
