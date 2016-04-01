var db = require('./config.js');

// var userId = db.Schema.Types.ObjectId();
// userId.auto(true);

var UserSchema = db.Schema({
  id: db.Schema.Types.ObjectId,
  username: String,
  password: String,
  createdAt: {type: Date, Default: Date.now}
});



module.exports = db.model('User', UserSchema);
