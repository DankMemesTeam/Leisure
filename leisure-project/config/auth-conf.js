const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { Strategy } = require('passport-local');
const MongoStore = require('connect-mongo')(session);
const hasher = require('password-hash');

module.exports = (app, data, db, secretString) => {
    const userData = data.userData;

    passport.use('local', new Strategy((username, password, done) => {
        userData.findUserBy({ username: username })
            .then((foundUser) => {
                // Validation should be made by a validator passed in the constructor
                if (!foundUser) {
                    return done(null, false, { message: 'User with that name does not exist. ' });
                }

                // FIX PASSWORD MISSMATCH / hashed not hashed
                if (!hasher.verify(password, foundUser.password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, foundUser);
            });
    }));

    const getSession = () => {
        return session({
            secret: secretString,
            store: new MongoStore({
                dbPromise: db,
            }),
            resave: true,
            saveUninitialized: true,
        });
    };

    app.use(cookieParser());
    app.use(getSession());

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((userId, done) => {
        userData.getUserById(userId)
            .then((foundUser) => {
                done(null, foundUser);
            })
            .catch(done);
    });

    app.use((req, res, next) => {
        res.locals = res.locals || {};

        res.locals.user = req.user;

        next();
    });

    return app;
};
