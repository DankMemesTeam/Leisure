const passport = require('passport');

module.exports = ({ app, express, data, controllers }) => {
    const router = new express.Router();
    const { authController } = controllers;
    // console.log(authController);

    router.get('/login', authController.loadLoginPage);
    router.get('/register', authController.loadRegisterPage);
    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
    router.post('/login', passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: false,
        }));

    router.post('/register', authController.createUser);

    router.get('/test', authController.getUser);

    app.use('/auth', router);
};

