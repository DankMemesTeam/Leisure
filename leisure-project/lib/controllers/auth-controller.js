module.exports = ({ userData }, renderer, hashGenerator, validator) => {
    return {
        loadLoginPage(req, res) {
            res.render('auth/login');
        },
        loadRegisterPage(req, res) {
            res.render('auth/register');
        },
        registerUser(req, res) {
            const user = req.body;

            hashGenerator.generateHash(user.password)
                .then((hashedPassword) => {
                    user.hashedPassword = hashedPassword;

                    return userData.createUser(user)
                })
                .then(() => res.redirect('/'))
                .catch(() => {
                    res.redirect('/auth/register');
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

