var db = require('./config.js');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

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

};

UserSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

module.exports = db.model('User', UserSchema);
