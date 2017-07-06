const passport = require('passport');

module.exports = ({ userData }) => {
    return {
        loadLoginPage(req, res) {
            res.render('login');
        },
        loadRegisterPage(req, res) {
            res.render('register');
        },
        createUser(req, res) {
            const user = req.body;
            userData.createUser(user)
                .then(res.redirect('/'));
        },
        getUser(req, res) {
            userData.findUserBy({ username: 'pesho' })
                .then((usr) => console.log(usr));
        },
        logIn(req, res) {
            console.log(req);
            console.log('CALLED');
        },
    };
};

