var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function (req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }, function (req, res) {
        if (req.user.username === 'root') {
            res.render('admin', {user: req.user});
        } else {
            res.redirect('/');
        }
    }
);

// school management
router.get('/schoollist', function (req, res) {
    var db = req.app.db;

    db.models.School.find({}, {}, function (err, schools) {
        res.json(schools);
    });
});

router.post('/addschool', function (req, res) {
    var db = req.app.db;
    var newSchool = new db.models.School();

    newSchool.name = req.body.name;
    db.models.User.findById(req.body.idOwner, function (err, user) {
        newSchool.owner = user;
        newSchool.save(function (err) {
            if (err) {
                res.send({msg: err});
            } else {
                if (user.roles.indexOf("chief") === -1) {
                    var roles = user.roles;

                    roles.push("chief");
                    db.models.User.where({_id: user._id}).update({$set: {roles: roles}}, function (err) {
                        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
                    });
                } else {
                    res.send({msg: ''});
                }
            }
        });
    });
});

router.get('/createschool', function (req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }, function (req, res) {
        if (req.user.username === 'root') {
            var db = req.app.db;

            db.models.User.find({}, {}, function (err, users) {
                res.render('createschool', {
                    user: req.user,
                    users: users
                });
            });
        } else {
            res.redirect('/');
        }
    }
);

router.delete('/deleteschool/:id', function (req, res) {
    var db = req.app.db;
    var schoolToDelete = req.params.id;

    db.models.School.findByIdAndRemove({_id: schoolToDelete}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

// group management
router.get('/grouplist/:id', function (req, res) {
    req.app.db.models.Group.find({'school._id': mongoose.Schema.Types.ObjectId(req.params.id)}, {}, function (err, groups) {
        res.json(groups);
    });
});

router.get('/group/:id', function (req, res) {
    req.app.db.models.Group.findOne({'_id': mongoose.Schema.Types.ObjectId(req.params.id)}, {}, function (err, group) {
        res.json(group);
    });
});

router.post('/addgroup', function (req, res) {
    var db = req.app.db;
    var newGroup = new db.models.Group();

    newGroup.name = req.body.name;
    newGroup.sigle = req.body.sigle;
    db.models.School.findById(req.body.idSchool, function (err, school) {
        newGroup.school = school;
        db.models.User.findById(req.body.idOwner, function (err, user) {
            newGroup.owner = user;
            newGroup.save(function (err) {
                if (err) {
                    res.send({msg: err});
                } else {
                    if (user.roles.indexOf("teacher") === -1) {
                        var roles = user.roles;

                        roles.push("teacher");
                        db.models.User.where({_id: user._id}).update({$set: {roles: roles}}, function (err) {
                            res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
                        });
                    } else {
                        res.send({msg: ''});
                    }
                }
            });
        });
    });
});

router.get('/creategroup/:id', function (req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }, function (req, res) {
        if (req.user.username === 'root') {
            var db = req.app.db;

            db.models.User.find({}, {}, function (err, users) {
                res.render('creategroup', {
                    user: req.user,
                    idSchool: req.params.id,
                    users: users
                });
            });
        } else {
            res.redirect('/');
        }
    }
);

router.delete('/deletegroup/:id', function (req, res) {
    var db = req.app.db;
    var groupToDelete = req.params.id;

    db.models.Group.findByIdAndRemove({_id: groupToDelete}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

// user management
router.get('/userlist', function (req, res) {
    var db = req.app.db;

    db.models.User.find({}, {}, function (err, users) {
        res.json(users);
    });
});

router.delete('/deleteuser/:id', function (req, res) {
    var db = req.app.db;
    var userToDelete = req.params.id;

    db.models.User.findByIdAndRemove({_id: userToDelete}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

router.post('/validateuser/:id', function (req, res) {
    var db = req.app.db;
    var userToValidate = req.params.id;

    db.models.User.where({_id: userToValidate}).update({$set: {isActive: true}}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

router.post('/invalidateuser/:id', function (req, res) {
    var db = req.app.db;
    var userToValidate = req.params.id;

    db.models.User.where({_id: userToValidate}).update({$set: {isActive: false}}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

router.get('/userlist/:id', function (req, res) {
    var db = req.app.db;
    var groupID = req.params.id;

    db.models.User.find({groups: groupID}, {}, function (err, users) {
        res.json(users);
    });
});

router.post('/addusertogroup', function (req, res) {
    var db = req.app.db;

    db.models.Group.findById(req.body.idGroup, function (err, group) {
        if (!err) {
            var newUser = new db.models.User();

            newUser.username = '';
            newUser.password = '';
            newUser.email = '';
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.isActive = false;
            newUser.groups = [group._id];
            newUser.roles = ["student"];
            newUser.save(function (err) {
                res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
            });
        }
    });
});

router.get('/createusertogroup/:id', function (req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }, function (req, res) {
        if (req.user.username === 'root') {
            res.render('createusertogroup', {
                user: req.user,
                idGroup: req.params.id
            });
        } else {
            res.redirect('/');
        }
    }
);

module.exports = router;
