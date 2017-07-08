module.exports = ({ userData }, hashGenerator, validator) => {
    return {
        loadLoginPage(req, res) {
            res.render('login');
        },
        loadRegisterPage(req, res) {
            res.render('register');
        },
        registerUser(req, res) {
            const user = req.body;

            if (!validator.isUserValid(user)) {
                res.redirect('/auth/register');
                return;
            }

            hashGenerator.generateHash(user.password)
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

