var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shortly');
module.exports = mongoose;