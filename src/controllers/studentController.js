// students controller
// includes all crud operations
var express =       require('express');
var router =        express.Router();
var mongoose =      require('mongoose');
var bodyParser =    require('body-parser'); //parse post
var methodOverride = require('method-override'); //manip post
var student =       require('./studentModel');
var mC =           mongoose.model('Student');

//make sure that every requests that hits this controller will pass through these functions
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

//READ route, search for all
router.get('/', function(req, res, next) {
    return mC.findAll(req, res, next)
      .then(function(docs){

        //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
        res.format({
          html: function(){
            //req param page should be available (student._page)
            res.render('students/index', {
              title: 'All students',
              "students": docs
            });
          },
          json: function(){
            res.json(docs);
          }
        })
      })
      .catch(function(err){
        // console.log('expressBuilder says: gurgle bubble pop fizzle:');
        console.error(err);
        //TEST THIS
        //  if (err) return handleError(err);
      });
});

// CREATE route
router.post('/', function(req, res){
    //DEBUG
    // console.log('adding new, lets inspect the req here that was passed in, then next, lets inspect the addNew method')
    // console.log(req)
    // console.log('see above the req')
    var student = mC.addNew(req, res)
      // .then(function(student){
        //student was created
        // console.log('added student, check it' + student);
        //response now
        res.format({
          html: function(){
            res.location('student'); //set address bar loc
            res.redirect('/students'); //success page forward
          },
          json: function(){
            res.json(student);
          }
        })
      // })
      // .catch(function(err){
      //     console.error(err);
      // });
});

//get create form route
router.get('/new', function(req, res){
  res.render('students/new', { title: 'Add new Student' });
});

//route this middleware to check id first
router.param('id', function(req, res, next, id){
  mC.findById(id, function(err, student){
    if(!err){
      req.id = id;
      next();
    } else {
      // console.log(id + ' was not found');
      res.status(404)
      var err = new Error('Not Found');
      err.status = 404;
      res.format({
          html: function(){
              next(err);
           },
          json: function(){
                 res.json({message : err.status  + ' ' + err});
           }
      });
    }
  });
});

//READ search by id
router.route('/:id')
  .get(function(req, res) {
    mC.findById(req.id, function(err, student){
      if(!err){
        // console.log('GET Retrieving ID: ' + student._id);

        var insertedFormatted = student.inserted.toISOString();
        insertedFormatted = insertedFormatted.substring(0,
          insertedFormatted.indexOf('T'));

        res.format({
          html: function(){
            res.render('students/show', {
              'inserted' : insertedFormatted,
              'student' : student
            });
          },
          json: function(){
            res.json(student);
          }
        })
      } else {
        console.error('GET Error: There was a problem retrieving: ' + err);
      }
    });
  });

  router.route('/:id/edit')
  // READ by id
    .get(function(req, res){
      //FUNCTION HERE
      mC.findById(req.id, function(err, student){
        if(!err){
          // console.log('GET Retrieving ID: ' + student._id);
          var insertedFormatted = student.inserted.toISOString();
          insertedFormatted = insertedFormatted.substring(0,
            insertedFormatted.indexOf('T'));
          res.format({
            html: function(){
              res.render('students/edit', {
                title: 'Student' + student._id,
                "inserted": insertedFormatted,
                "student": student
              })
            },
            json: function(){
              res.json(student);
            }
          });
        } else {
          console.error('GET Error: There was a problem retrieving: ' + err);
        }
      });
    });

  // UPDATE by id
  router.route('/:id/edit').put(function(req, res){
      mC.updateById(req, res);
  })

  //delete
  router.delete('/:id/edit', function(req, res){
    console.log('DELETE removing ID: ' + student._id);
    mC.findOneAndRemove(req.id, function(err, student){
      if(!err){
        res.format({
          html: function(){
            res.location('students'); //set address bar loc
            res.redirect('/students');
          },
          json: function(){
            res.json({
              message: 'deleted',
              item: student
            });
          }
        });
      } else {
        console.error(err);
      }
    });


  });

  //export
  module.exports = router;
