import $ from 'jquery';
import toastr from 'toastr';
import { validatorModule } from 'validator-module';

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
    const username = validatorModule.validateUsername($('#usernameInput').val());
    const firstName = validatorModule.validateName($('#firstName').val(), 'First name');
    const lastname = validatorModule.validateName($('#lastName').val(), 'Last name');
    const email = validatorModule.validateEmail($('#emailInput').val());
    const password = validatorModule.validatePassword($('#inputPassword').val());
    console.log(toastr);
    if (!username.isValid) {
        toastr.error(username.message);
        return;
    }

    if (!firstName.isValid) {
        toastr.error(firstName.message);
        return;
    }

    if (!lastname.isValid) {
        toastr.error(lastname.message);
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
            lastname: lastname.result,
            email: email.result,
            password: password.result,
        })
            .then((response) => {
                if (response.errorMessage) {
                    return toastr.error(response.errorMessage);
                }

                window.location.replace(response.redirectUrl);
            });
    }
});

