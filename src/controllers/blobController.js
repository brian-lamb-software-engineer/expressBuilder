/**
 * Blobs controller / RESTful API CRUD  routes and controller
 * see for more info -https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 * includes all crud operations
 *
 * Route Definition:
 * app.METHOD(PATH, HANDLER)
 * Where:
 * app is an instance of express.
 * METHOD is an HTTP request method, in lowercase.
 * PATH is a path on the server.
 * HANDLER is the function executed when the route is matched.
 **/
var express =       require('express');
var router =        express.Router();
var mongoose =      require('mongoose');
var bodyParser =    require('body-parser');//parse post
var methodOverride = require('method-override');//manip post
var doc =          require('./blobModel');

/**
 * ExpressJS MethodOverride
 * https://github.com/expressjs/method-override
 * https://www.npmjs.com/package/method-override
 * Make sure that every requests that hits this controller will pass through
 * these functions
 *
 * NOTE It is very important that this module is used before any module that
 *      needs to know the method of the request
 *
 * NOTE: when using req.body, you must fully parse the request body
 *       before you call methodOverride() in your middleware stack,
 *       otherwise req.body will not be populated.
 *
 * e.g. call with query override
 * enctype must be set to the type you will parse before methodOverride()
 * form(method='POST', action='/resource', enctype='application/x-www-form-urlencoded')
 *   input(type='hidden', name='_method', value='DELETE')
 *   button(type='submit') Delete resource
 *
 * @type {[type]}
 */
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
  console.log(req.body)
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

router.route('/')
//READ
  .get( function(req, res, next) {
    console.error(req.params);
      mongoose.model('Blob').findAll(req, res);
    })
    /**
     * WORKING, commenting so i can move out as model method
     .post( function(req, res){
         //get vals from post, via forms or api calls
         //relys on name attr of form
         var name = req.body.name,
             badge = req.body.badge,
             dob = req.body.dob,
             company = req.body.company,
             isloved = req.body.isloved;
             mongoose.model('Blob').create({
               name: name,
               badge: badge,
               dob: dob,
               isloved: isloved
             }, function (err, doc) {
               if (!err){
                 //doc was created
                 console.log('New Blob');
                 console.log(doc);
                 res.format({
                   html: function(){
                     res.location('blobs'); //set address bar loc
                     res.redirect('/blobs'); //success page forward
                   },
                   json: function(){
                     res.json(doc);
                   }
                 })
               } else {
                 res.send("There was a problem adding the info to the database!")
                 //is this else necessary?
               }
             });
       });
     */
  .post( function(req, res){
    mongoose.model('Blob').addDoc(req, res);
  });

  //route to a jade form
  router.get('/new', function(req, res){
    res.render('blobs/new', { title: 'Add new Blob' });
  });

  //route this middleware to check id first
  router.param('id', function(req, res, next, id){
    mongoose.model('Blob').findById(id, function(err, doc){
      if(!err){
        req.id = id;
        next();
      } else {
        console.log(id + ' was not found');
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

  //get doc by id, for display

  // router.get('/:id', crud, function(req, res) {
  //   res.json(doc);
  // }
  router.route('/:id')
    .get(function(req, res) {
      mongoose.model('Blob').findById(id, function(err, doc){
        if(!err){
          console.log('GET Retrieving ID: ' + doc._id);
          var dob = doc.dob.toISOString();
          dob = dob.substring(0, dob.indexOf('T'));
          res.format({
            html: function(){
              res.render('blobs/show', {
                'blob' : dob,
                'blob' : doc
              });
            },
            json: function(){
              res.json(doc);
            }
          })
        } else {
          console.log('GET Error: There was a problem retrieving: ' + err);
        }
      });
    });

    //edit and update via form
    //get by id
    router.route('/:id/edit')
      .get(function(req, res){
        //search
        mongoose.model('Blob').findById(req.id, function(err, doc){
          if(!err){
            //Return the doc
            console.log('GET Retrieving ID: ' + doc._id);
            //format Date
            var dob = doc.dob.toISOString();
            dob = dob.substring(0, dob.indexOf('T'));
            res.format({
              html: function(){
                res.render('blobs/edit', {
                  title: 'Blob' + doc._id,
                  "dob": dob,
                  "blob": doc
                })
              },
              json: function(){
                res.json(doc);
              }
            });
          } else {
            console.log('GET Error: There was a problem retrieving: ' + err);
          }
        });
      })
      //put (accepts REEST and form POST requests)
      .put(function(req, res){
        var name    = req.body.name;
        var badge   = req.body.badge;
        var dob     = req.body.dob;
        var company = req.body.company;
        var isloved = req.body.isloved;

        //find by id
        mongoose.model('Blob').findById(req.id, function (err, doc){
          doc.update({
            name: name,
            badge: badge,
            dob: dob,
            isloved: isloved
          }, function (err, blobID){
            if(!err){
              //response  //alternatively you can a add new view that shows success
              res.format({
                html: function(){
                  res.redirect('/blobs/' + doc._id); //go back to page
                },
                json: function(){
                  res.json(doc); //show updated vals
                }
              });
            } else {
              res.send("There was a problem updating the information to the database: " + err);
            }
          })
        });
      })
    //delete
    .delete(function(req, res){
      //find by id
      mongoose.model('Blob').findById(req.id, function(err, doc){
        if(!err){
          //remove it from Mongo
          doc.remove(function (err, doc) {
            console.log('DELETE removing ID: ' + doc._id);
            res.format({
              html: function(){
                res.redirect('/blobs');
              },
              json: function(){
                res.json({
                  message: 'deleted',
                  item: doc
                });
              }
            });
          });
        } else {
          return console.error(err);
        }
      });
    });

    //export
    module.exports = router;
