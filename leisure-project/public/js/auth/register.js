/*eslint-disable*/

const registerUser = (userObj) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/auth/register',
            type: 'POST',
            dataType: 'json',
            data: userObj,
            success: resolve,
            error: reject,
        });
    });
};

$('#register-btn').click((ev) => {
    const username = validateUsername($('#usernameInput').val());
    const firstName = validateName($('#firstName').val(), 'First name');
    const lastName = validateName($('#lastName').val(), 'Last name');
    const email = validateEmail($('#emailInput').val());
    const password = validatePassword($('#inputPassword').val());

    if (!username.isValid) {
        toastr.error(username.message);
        return;
    }

    if (!firstName.isValid) {
        toastr.error(firstName.message);
        return;
    }

    if (!lastName.isValid) {
        toastr.error(lastName.message);
        return;
    }

    if (!email.isValid) {
        toastr.error(email.message);
        return;
    }

    if (!password.isValid) {
        toastr.error(password.message);
    } else {
        registerUser({
            username: username.result,
            firstName: firstName.result,
            lastName: lastName.result,
            email: email.result,
            password: password.result,
        })
            .then((response) => {
                if (response.errorMessage) {
                    return toastr.error(response.errorMessage);
                }

                toastr.success('Successfully registered!');
                return window.location.replace(response.redirectUrl);
            });
    }
});

