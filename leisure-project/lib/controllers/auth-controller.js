const bcrypt = require('bcrypt');

module.exports = ({ userData }) => {
    return {
        loadLoginPage(req, res) {
            res.render('login');
        },
        loadRegisterPage(req, res) {
            res.render('register');
        },
        registerUser(req, res) {
            const user = req.body;

            user.hashedPassword = 'muchHash';

            userData.createUser(user)
                .then(res.redirect('/'));
        },
        getUser(req, res) {
            userData.getAllUsers()
            .then((users) => {
                console.log(users);
            });
        },
    };
};

