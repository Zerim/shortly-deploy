var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var User = require('../app/mongo_models/user');
var Link = require('../app/mongo_models/link');
var mongo = require('../app/mongo_models/config.js');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  console.log(req.body);
  Link.find().exec().then(function(list) {
    res.send(200, list);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({ url: uri }).exec().then(function(list) {
    if (list.length !== 0) {
      res.send(200, list[0]);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.save(function(error) {
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({username: username}).exec().then(function(list) {
    if (list.length === 0 ) {
      res.redirect('/login');
    } else {
      list[0].comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, list[0]);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.find({username: username}).exec().then(function(list) {
    if (list.length === 0) {
      var user = new User({username: username, password: password});
      user.save(function(error) {
        util.createSession(req, res, user);
      });
    } else {
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {

  Link.find({code: req.params[0]}).exec().then(function(list) {
    if (list.length === 0) {
      res.redirect('/');
    } else {
      list[0].set({visits: list[0].get('visits') + 1 }).save(function(err) {
        return res.redirect(list[0].get('url'));
      });
    }
  });
};