exports = module.exports = function(app, passport) {
    var localStrategy = require('passport-local').Strategy;
    var bCrypt = require('bcrypt');

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        app.db.models.User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };

    passport.use('login',
        new localStrategy({
                passReqToCallback: true
            },
            function (req, username, password, done) {
                app.db.models.User.findOne({'username': username},
                    function (err, user) {
                        // In case of any error, return using the done method
                        if (err)
                            return done(err);
                        // Username does not exist, log error & redirect back
                        if (!user) {
                            console.log('User Not Found with username ' + username);
                            return done(null, false,
                                req.flash('message', 'User Not found.'));
                        }
                        if (!user.isActive) {
                            console.log('User Not Active');
                            return done(null, false,
                                req.flash('message', 'User Not Active.'));
                        }
                        // User exists but wrong password, log the error
                        if (!isValidPassword(user, password)) {
                            console.log('Invalid Password');
                            return done(null, false,
                                req.flash('message', 'Invalid Password'));
                        }
                        // User and password both match, return user from
                        // done method which will be treated like success
                        return done(null, user);
                    }
                );
            }
        ));

    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

    passport.use('signup',
        new localStrategy({
                passReqToCallback: true
            },
            function (req, username, password, done) {
                findOrCreateUser = function () {
                    app.db.models.User.findOne({'username': username}, function (err, user) {
                        if (err) {
                            console.log('Error in SignUp: ' + err);
                            return done(err);
                        }
                        if (user) {
                            console.log('User already exists');
                            return done(null, false,
                                req.flash('message', 'User Already Exists'));
                        } else {
                            var newUser = new app.db.models.User();
                            newUser.username = username;
                            newUser.password = createHash(password);
                            newUser.email = req.param('email');
                            newUser.firstName = req.param('firstName');
                            newUser.lastName = req.param('lastName');
                            newUser.isActive = false;
                            newUser.groups = [];
                            newUser.roles = [];
                            newUser.save(function (err) {
                                if (err) {
                                    console.log('Error in Saving user: ' + err);
                                    throw err;
                                }
                                console.log('User Registration successful');
                                return done(null, newUser);
                            });
                        }
                    });
                };
                process.nextTick(findOrCreateUser);
            })
    );
};