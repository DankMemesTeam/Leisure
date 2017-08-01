/*eslint-disable*/

const loginUser = (userObj) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/auth/login',
            type: 'POST',
            data: userObj,
            success: resolve,
            error: reject,
        });
    });
};

$('#login-form').submit((ev) => {
    const username = sanitizeStringInput($('#usernameInput').val());
    const password = sanitizeStringInput($('#inputPassword').val());

    $('#usernameInput').val(username);
    $('#inputPassword').val(password);
});
