/*eslint-disable*/

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

const updateField = (postUrl, body) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: postUrl,
            type: 'POST',
            dataType: 'json',
            data: body,
            success: resolve,
            error: reject,
        });
    });
};

$('#update-firstName-btn').click((ev) => {
    const newName = validateName($('#firstName').val(), 'First name');
    const postUrl = window.location.href;

    if (!newName.isValid) {
        return toastr.error(newName.message);
    }

    return updateField(postUrl, { firstName: newName.result })
        .then((response) => {
            if (response.errorMessage) {
                return toastr.error(response.errorMessage);
            }

            $('#firstName').val('');
            return toastr.success('Successfully updated first name!');
        });
});

$('#update-lastname-btn').click((ev) => {
    const newName = validateName($('#lastName').val(), 'Last name');
    const postUrl = window.location.href;

    if (!newName.isValid) {
        return toastr.error(newName.message);
    }

    return updateField(postUrl, { lastName: newName.result })
        .then((response) => {
            if (response.errorMessage) {
                return toastr.error(response.errorMessage);
            }

            $('#lastName').val('');
            return toastr.success('Successfully updated last name!');
        });
});

$('#update-birthDate-btn').click((ev) => {
    const newDate = validateDate($('#birthDate').val());
    const postUrl = window.location.href;

    if (!newDate.isValid) {
        return toastr.error(newDate.message);
    }

    return updateField(postUrl, { birthDate: newDate.result })
        .then((response) => {
            if (response.errorMessage) {
                return toastr.error(response.errorMessage);
            }

            $('#birthDate').val('');
            return toastr.success('Successfully updated birth date!');
        });
});


$('#update-aboutMe-btn').click((ev) => {
    const newDescription = validateText($('#aboutMe').val(), 'About me');
    const postUrl = window.location.href;

    if (!newDescription.isValid) {
        return toastr.error(newDescription.message);
    }

    return updateField(postUrl, { aboutMe: newDescription.result })
        .then((response) => {
            if (response.errorMessage) {
                return toastr.error(response.errorMessage);
            }

            $('#aboutMe').val('');
            return toastr.success('Successfully updated about me!');
        });
});
