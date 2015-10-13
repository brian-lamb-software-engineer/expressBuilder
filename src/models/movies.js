var mongoose = require('mongoose');
var movieSchema = new mongoose.Schema({
  name:String,
  length:Date,
  starring:String,
  year:Number,
  notes:String,
  retail:Boolean,
  inserted: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now}
});
mongoose.model('Movie', movieSchema);
