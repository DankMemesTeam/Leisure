const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);

module.exports = (app, data, db, secretString) => {
    const userData = data.userData;
    // console.log(userData);
    // Auth strategy
    passport.use('local', new LocalStrategy((username, password, done) => {
        userData.findUserBy({ username: username })
            .then((foundUser) => {
                if (!foundUser) {
                    return done(null, false, { message: 'User with that name does not exist. ' });
                }

                if (foundUser.password !== password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, foundUser);
            });
    }));


    app.use(session({
        secret: secretString,
        store: new MongoStore({
            dbPromise: db,
        }),
        resave: true,
        saveUninitialized: true,

    }));

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

    // Add the user object to all responses
    app.use((req, res, next) => {
        console.log(req.session);

        res.locals = {
            user: req.user,
        };
        next();
    });
};

// logIn
// login
// logOut
// logout
// isAuthenticated
// isUnauthenticated
