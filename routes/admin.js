var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/primschool');

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
    var db = req.db;
    var collection = db.get('schools');

    collection.find({}, {}, function (err, schools) {
        res.json(schools);
    });
});

router.post('/addschool', function(req, res) {
    var db = req.db;
    var collection = db.get('schools');

    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

router.get('/createschool', function (req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }, function (req, res) {
        if (req.user.username === 'root') {
            res.render('createschool', {user: req.user});
        } else {
            res.redirect('/');
        }
    }
);

router.delete('/deleteschool/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('schools');
    var schoolToDelete = req.params.id;

    collection.remove({'_id': schoolToDelete}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

// group management
router.get('/grouplist', function (req, res) {
    var db = req.db;
    var collection = db.get('groups');

    collection.find({}, {}, function (err, groups) {
        res.json(groups);
    });
});

// user management
router.get('/userlist', function (req, res) {
    var db = req.db;
    var collection = db.get('users');

    collection.find({}, {}, function (err, users) {
        res.json(users);
    });
});

router.delete('/deleteuser/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('users');
    var userToDelete = req.params.id;

    collection.remove({'_id': userToDelete}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

router.post('/validateuser/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('users');
    var userToValidate = req.params.id;

    collection.update(userToValidate, {$set: {isActive: true}}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

router.post('/invalidateuser/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('users');
    var userToValidate = req.params.id;

    collection.update(userToValidate, {$set: {isActive: false}}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

module.exports = router;
