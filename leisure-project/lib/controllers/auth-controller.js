const bcrypt = require('bcrypt');

module.exports = ({ userData }) => {
    const hashingSaltRounds = 10;

    return {
        loadLoginPage(req, res) {
            res.render('login');
        },
        loadRegisterPage(req, res) {
            res.render('register');
        },
        registerUser(req, res) {
            const user = req.body;

            bcrypt.hash(user.password, hashingSaltRounds)
                .then((hashedPassword) => {
                    user.hashedPassword = hashedPassword;

                    userData.createUser(user)
                        .then(res.redirect('/'));
                });

        },
        getUser(req, res) {
            userData.getAllUsers()
                .then((users) => {
                    console.log(users);
                });
        },
    };
};

