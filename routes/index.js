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
var passport = require('passport');

router.get('/', function(req, res) {
  res.render('index', { user: req.user });
});

router.get('/login', function(req, res) {
  res.render('login', { message: req.flash('message') });
});

router.post('/login', passport.authenticate('login', {
  successRedirect: '/admin',
  failureRedirect: '/login',
  failureFlash : true
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/signup', function(req, res){
  res.render('signup',{message: req.flash('message')});
});

router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/logout',
  failureRedirect: '/signup',
  failureFlash : true
}));

module.exports = router;
