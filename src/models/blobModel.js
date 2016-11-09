//
var mm = require('mongoose');
var blobSchema = new mm.Schema({
  name:String,
  badge: Number,
  dob: {type: Date, default: Date.now},
  isloved: Boolean
});
mm.model('Blob', blobSchema);
