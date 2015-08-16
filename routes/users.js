var express = require('express');
var router = express.Router();

router.get('/list', function(req, res) {
    var db = req.db;
    var collection = db.get('users');

    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.post('/add', function(req, res) {
    var db = req.db;
    var collection = db.get('users');

    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    var userToDelete = req.params.id;

    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
