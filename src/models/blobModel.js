/**
 * [mongoose description]
 * @type {[type]}
 */
var mongoose = require('mongoose');

/**
 * [model is the schema for this item your modeling to persist into the
 * database]
 * See mongoose odm site for schema types and examples
 * @type {Object}
 */
var model={
  name:String,
  badge: Number,
  dob: {type: Date, default: Date.now},
  isloved: Boolean
};

/**
 * [mongooseSchema instantiates a new object on indicated schema model.]
 * @type {mongoose}
 */
var mongooseSchema = new mongoose.Schema(model);

/**
 * [doc is your new local object to which you can operate on;  Here in the model
 * file(assuming MVC)]
 * @type {[type]}
 * compile it (not necessary to set to a var unless needed for statics)
 */
var doc = mongoose.model('Blob', mongooseSchema);

/**
 * STATICS
 *
 * [findAll description]
 * @param  {[type]} req [the request obj]
 * @param  {[type]} res [the response object]
 * @return {[json obj]} [the searched data items]
 */
doc.findAll = function(req, res){
  return this.model('Blob').find({ type: this.type },
    function(err, blobs) {
      if(!err){
        //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
        res.format({
          html: function(){
            res.render('blobs/index', {
              title: 'All my Blobs',
              "blobs": blobs
            });
          },
          json: function(blobs){
            // res.json(infophotos);
            res.json(blobs);
          }
        })
      } else {
        return  console.error(err);
      }
  });
};

/**
 * [addDoc description]
 * @param  {[type]} req [the request obj]
 * @param  {[type]} res [the response object]
 */
doc.addDoc = function(req, res){
  //get vals from post, via forms or api calls
  //relys on name attr of form
  var name = req.body.name;
  var badge = req.body.badge;
  var dob = req.body.dob;
  var isloved = req.body.isloved;

  mongoose.model('Blob').create({
    name: name,
    badge: badge,
    dob: dob,
    isloved: isloved
  }, function (err, blob) {
    if (!err){
      //blob was created
      console.log('New Blob');
      console.log(blob);
      res.format({
        html: function(){
          res.location('blobs'); //set address bar loc
          res.redirect('/blobs'); //success page forward
        },
        json: function(){
          res.json(blob);
        }
      })
    } else {
      res.send("There was a problem adding the info to the database!")
      //is this else necessary?
    }
  });
};
