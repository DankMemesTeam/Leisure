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

                    return userData.createUser(user);
                })
                .then(() => {
                    return res.json({ redirectUrl: '/auth/login' });
                })
                .catch((err) => {
                    return res.json({ errorMessage: 'Could not register user!' });
                });
        },
    };
};

