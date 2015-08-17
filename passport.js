var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt');
var monk = require('monk');
var db = monk('localhost:27017/primschool');

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    var collection = db.get('users');

    collection.find({'_id': id}, {}, function (err, users) {
        done(err, users[0]);
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
            // check in mongo if a user with username exists or not
            var collection = db.get('users');

            collection.find({'username': username}, {},
                function (err, users) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log error & redirect back
                    if (users.length == 0) {
                        console.log('User Not Found with username ' + username);
                        return done(null, false,
                            req.flash('message', 'User Not found.'));
                    }
                    if (!users[0].isActive) {
                        console.log('User Not Active');
                        return done(null, false,
                            req.flash('message', 'User Not Active.'));
                    }
                    // User exists but wrong password, log the error
                    if (!isValidPassword(users[0], password)) {
                        console.log('Invalid Password');
                        return done(null, false,
                            req.flash('message', 'Invalid Password'));
                    }
                    // User and password both match, return user from
                    // done method which will be treated like success
                    return done(null, users[0]);
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
                var collection = db.get('users');

                collection.find({'username': username}, {}, function (err, users) {
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    if (users.length > 0) {
                        console.log('User already exists');
                        return done(null, false,
                            req.flash('message', 'User Already Exists'));
                    } else {
                        var collection = db.get('users');
                        var newUser = {
                            username: username,
                            password: createHash(password),
                            email: req.param('email'),
                            firstName: req.param('firstName'),
                            lastName: req.param('lastName'),
                            isActive: false
                        };

                        collection.insert(newUser, function (err, result) {
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