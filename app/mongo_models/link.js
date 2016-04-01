var db = require('./config.js');
var crypto = require('crypto');

var LinkSchema = db.Schema({
  id: db.Schema.Types.ObjectId,
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  createdAt: {type: Date, default: Date.now}
});

LinkSchema.pre('save', function(next) {
  // console.log('EXECUTION CONTEXT:    ', this.constructor); 
  var shasum = crypto.createHash('sha1');
  shasum.update(this.get('url'));
  this.set('code', shasum.digest('hex').slice(0, 5));
  next();
});

module.exports = db.model('Link', LinkSchema);