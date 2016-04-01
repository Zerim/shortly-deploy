var db = require('./config.js');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


// var userId = db.Schema.Types.ObjectId();
// userId.auto(true);

var UserSchema = db.Schema({
  id: db.Schema.Types.ObjectId,
  username: String,
  password: String,
  createdAt: {type: Date, Default: Date.now}
});

UserSchema.methods.comparePassword = function(attempted, callback) {
  console.log('COMPARING TO   ', this.get('password'));
  bcrypt.compare(attempted, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

UserSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
      console.log(hash, '******************  THIS:    ', this);
      this.set({'password': hash});
    }.bind(this));
};

UserSchema.pre('save', function(next) {
  this.hashPassword();
  next();
});


module.exports = db.model('User', UserSchema);
