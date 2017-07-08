const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { Strategy } = require('passport-local');
const MongoStore = require('connect-mongo')(session);

module.exports = (app, data, db, secretString, hashGenerator) => {
    const userData = data.userData;

    passport.use('local', new Strategy((username, password, done) => {
        userData.findUserBy({ username: username })
            .then((foundUser) => {
                if (!foundUser) {
                    return done(null, false,
                        { message: 'User with that name does not exist. ' });
                }
                hashGenerator.verify(password, foundUser.hashedPassword)
                    .then(() => {
                        return done(null, foundUser);
                    })
                    .catch(() => {
                        return done(null, false,
                            { message: 'Incorrect password.' });
                    });
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
