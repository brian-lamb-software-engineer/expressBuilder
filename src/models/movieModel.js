/**
 * [mapper description]
 * @type {[type]}
 */
var mapper = require('mongoose');

/**
 * [model description]
 * @type {Object}
 */
var model = {
  name:String,
  length:Date,
  starring:String,
  year:Number,
  notes:String,
  retail:Boolean,
  inserted: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now}
};

/**
 * [movieSchema description]
 * @type {mapper}
 */
var object = new mapper.Schema(model);

// compile it
mapper.model('Movie', object);

/**
 * Getters
 */
// var getTags = function (tags) {
//   return tags.join(',');
// };

/**
 * Setters
 */
 // var setTags = function (tags) {
 //   return tags.split(',');
 // };
