/**
 *  This file is part of PrimSchool project.
 *
 *  PrimSchool is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This Web application is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with PrimSchool.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @copyright     Copyright (c) PrimSchool
 * @link          http://primschool.org
 * @license       http://www.gnu.org/licenses/ GPLv3 License
 */

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
        newGroup.school.id = school._id;
        newGroup.school.name = school.name;
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
router.get('/userlist/:id', function (req, res) {
    var db = req.app.db;
    var schoolID = req.params.id;

    if (schoolID === -1) {
        db.models.User.find({}, {}, function (err, users) {
            res.json(users);
        });
    } else {
        db.models.School.findById(schoolID, function (err, school) {
            if (err) {
                res.json();
            } else {
                db.models.User.find({school: school._id}, {}, function (err, users) {
                    res.json(users);
                });
            }
        });
    }
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

router.get('/userlistofgroup/:idGroup', function (req, res) {
    var db = req.app.db;

    db.models.Group.findById(req.params.idGroup, function (err, group) {
        if (err) {
            res.json();
        } else {
            db.models.User.find({groups: group._id}, {}, function (err, users) {
                res.json(users);
            });
        }
    });
});

router.post('/addusertogroup', function (req, res) {
    var db = req.app.db;

    db.models.Group.findById(req.body.idGroup, function (err, group) {
        if (!err) {
            var username = req.body.firstName.charAt(0) + req.body.lastName;
            var newUser = new db.models.User();

            newUser.username = username;
            newUser.password = '';
            newUser.email = '';
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.isActive = false;
            newUser.groups = [group._id];
            newUser.school = group.school.id;
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

router.post('/removeusertogroup/:idUser/:idGroup', function (req, res) {
    var db = req.app.db;
    var idUser = req.params.idUser;
    var idGroup = req.params.idGroup;

    db.models.User.findById(idUser, function (err, user) {
        if (!err) {
            db.models.Group.findById(req.body.idGroup, function (err, group) {
                if (!err) {
                    var groups = user.groups;
                    var index = groups.indexOf(group._id);

                    groups.splice(index, 1);
                    db.models.User.where({_id: idUser}).update({$set: {groups: groups}}, function (err) {
                        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
                    });
                } else {
                    res.send({msg: 'error: ' + err});
                }
            });
        } else {
            res.send({msg: 'error: ' + err});
        }
    });
});

router.get('/assignusertogroup/:idUser/:idSchool', function (req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }, function (req, res) {
        if (req.user.username === 'root') {
            req.app.db.models.User.findById(req.params.idUser, function (err, student) {
                req.app.db.models.School.findById(req.params.idSchool, function (err, school) {
                    req.app.db.models.Group.find({'school.id': school._id}, {}, function (err, groups) {
                        res.render('assignusertogroup', {
                            user: req.user,
                            school: school,
                            student: student,
                            groups: groups
                        });
                    });
                });
            });
        } else {
            res.redirect('/');
        }
    }
);

router.post('/assignusertogroup/:idUser/:idGroup', function (req, res) {
    var db = req.app.db;
    var idUser = req.params.idUser;
    var idGroup = req.params.idGroup;

    db.models.User.findById(idUser, function (err, user) {
        if (!err) {
            db.models.Group.findById(req.body.idGroup, function (err, group) {
                if (!err) {
                    var groups = user.groups;

                    groups.push(group._id);
                    db.models.User.where({_id: idUser}).update({$set: {groups: groups}}, function (err) {
                        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
                    });
                } else {
                    res.send({msg: 'error: ' + err});
                }
            });
        } else {
            res.send({msg: 'error: ' + err});
        }
    });
});

module.exports = router;
