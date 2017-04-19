/**
 * expresBuilder
 * MVC MODEL
 * for express v3.0
 *
 * Purpose for this student model is to become an adaption model for the blob
 * and movie sections, as a basic standard update, before moving to express 4.
 *
 * Features & latest implementations
 * - Static Methods
 * - css udpates for assoc. jade templates
 */

/**
 * [mongoose description]
 * @type {[type]}
 */
var mongoose = require('mongoose');

/**
 * [validate description]
 * @type {[type]}
 */
// var validate = require('express-jsonschema').validate;

/**
 * [mMap description]
 * @type {Object}
 */
var mMap = {
  // name:{
  //   type: String,
  //   required: true
  // },
  name:String,
  major:String,
  dorm:Number,
  graduation_year:Number,
  active:Boolean,
  inserted: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now}
}


/**
 * mO - a Mongoose ODM schema
 * Defines our collection
 *  - Access using Key lookup on the key-value store or the API query language.
 * @type {obj mongoose}
 */
var mO = mongoose.Schema(mMap);


var dateIs = new Date();
var dateStr = Date.now.toString();

// E.g.
// var doc = new mC({
//   name: 'Joe Schmoe',
//   major: 'Field Billogy',
//   dorm: '75',
//   graduation_year: '2024',
//   active: true,
//   inserted: dateStr,
//   updated: dateStr
// })

/**
 * Add a method to a given doc
 */
 // mO.methods.speak = function () {
 //   var greeting = this.name
 //     ? "Meow name is " + this.name
 //     : "I don't have a name";
 //   console.log(greeting);
 // }
 // var doc = mongoose.model('Student', mO);

/**
 * mC modelClass
 * Compiles into a class to which we can construct documents with
 * e mappable collection object based on provided schema above
 * (not necessary to set to a var)
 * @type {[type]}
 */
var mC = mongoose.model('Student', mO);

/**
 * STATICS
 *
 * [addNew description]
 * @param  {[type]} req [the request obj]
 * @param  {[type]} res [the response object]
 * @returns {promise obj} student data with success
 */
mC.addNew = function(req, res){
  //get vals from post, via forms or api calls
  //relys on name attr of form
  var name = req.body.name;
  var major = req.body.major;
  var dorm = req.body.dorm;
  var graduation_year = req.body.graduation_year;
  var active = req.body.active;
  var dateIs = new Date();
  var updateStr = dateIs.toString();
  var inserted = updateStr;
  var updated = updateStr;

  var student = new mC({
    name: name,
    major: major,
    dorm: dorm,
    active: active,
    graduation_year: graduation_year,
    inserted: inserted,
    updated: updated
  });
  // , function (err, doc) {
    //INCORPORATE THE BELOW INTO THE REST OF THE CODE< IF IT WORKS,
    //IF NOT< THEN IMPLEMENT THE HANDLER
    //if (err) return handleError(err);
    //
    student.save(function (err, student) {
      if (err) return console.error(err);
      console.error('saved student');
      console.error(student);
      // student.speak();
      //res.json(student);
    });

    // if(!err){
    //   console.log('doc');
    //   console.log(doc);
    //   //return doc;
    // } else {
    //   //console.error(err);
    //   res.send("There was a problem adding the info to the database!")
    // }
  // });
};

/**
 * [findAll description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {promise obj} students
 */
mC.findAll = function(req, res, next){
  return this.find()
  //.select('name')
  .limit(100)
  .skip(20) //as demo, incidentally they have ugly names
  .sort({name: 'asc'})
  .exec(
    function(err, students) {
    if(!err){
      return students;
    } else {
      return  console.error(err);
    }
  })
};

/**
 * [updateById description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
mC.updateById = function(req, res){
  var name = req.body.name;
  var major = req.body.major;
  var dorm = req.body.dorm;
  var graduation_year = req.body.graduation_year;
  var active = req.body.active;
  var dateIs = new Date();
  var updateStr = dateIs.toString();
  var updated = updateStr;
  this.findById(req.id, function (err, mC){

    // console.log('found, and putting to ');
    // console.log(mC);
    // console.log(req.body);

    this.update({
      name: name,
      major: major,
      dorm: dorm,
      graduation_year: graduation_year,
      active: active,
      updated: updated
    }, function (err, studentID){
      if(!err){
        //response  //alternatively you can a add new view that shows
        //success
        res.format({
          html: function(){
            res.redirect('/students/' + mC._id); //go back to page
          },
          json: function(){
            res.json(mC); //show updated vals
          }
        });
      } else {
        res.send("There was a problem updating the information to the database: " + err);
      }
    })
  });
};

mC.deleteOne = function(req){
  mC.findOneAndRemove(req.id, function(err, student){
    if(!err){
        return student;
    } else {
      // console.error(err);
      return err;
    }
  });
}
// // assign a function to the "statics" object of our animalSchema
// mongoose.findByName = function(name, cb) {
//   return this.find({ name: new RegExp(name, 'i') }, cb);
// };
//
// /**
//  *
//  */
// mongoose.findByName('wally', function(err, object) {
//   console.log(object);
//   return object;
// });
