// blobs controller
// includes all crud operations
// rest calls can respond via

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),//parse post
    methodOverride = require('method-override');//manip post

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

//crud
//build the REST operations at the base for blobs
router.route('/')
  .get(function(req, res, next) {
      mongoose.model('Blob').find({}, function(err, blobs) {
        if(!err){
          //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
          res.format({
            html: function(){
              res.render('blobs/index', {
                title: 'All my Blobs',
                "blobs": blobs
              });
            },
            json: function(){
              res.json(infophotos);
            }
          })
        } else {
          return  console.error(err);
        }
      });
    })
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
    });

    //route to a jade form
    router.get('/new', function(req, res){
      res.render('blobs/new', { title: 'Add new Blob' });
    });

    //route this middleware to check id first
    router.param('id', function(req, res, next, id){
      mongoose.model('Blob').findById(id, function(err, blob){
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

    //get blob by id, for display
    router.route('/:id')
      .get(function(req, res) {
        mongoose.model('Blob').findById(req.id, function(err, blob){
          if(!err){
            console.log('GET Retrieving ID: ' + blob._id);
            var blobdob = blob.dob.toISOString();
            blobdob = blobdob.substring(0, blobdob.indexOf('T'));
            res.format({
              html: function(){
                res.render('blobs/show', {
                  'blobdob' : blobdob,
                  'blob' : blob
                });
              },
              json: function(){
                res.json(blob);
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
          mongoose.model('Blob').findById(req.id, function(err, blob){
            if(!err){
              //Return the blob
              console.log('GET Retrieving ID: ' + blob._id);
              //format Date
              var blobdob = blob.dob.toISOString();
              blobdob = blobdob.substring(0, blobdob.indexOf('T'));
              res.format({
                html: function(){
                  res.render('blobs/edit', {
                    title: 'Blob' + blob._id,
                    "blobdob": blobdob,
                    "blob": blob
                  })
                },
                json: function(){
                  res.json(blob);
                }
              });
            } else {
              console.log('GET Error: There was a problem retrieving: ' + err);
            }
          });
        })
        //put
        .put(function(req, res){
          var name = req.body.name,
              badge = req.body.badge,
              dob = req.body.dob,
              company = req.body.company,
              isloved = req.body.isloved;
              //find by id
              mongoose.model('Blob').findById(req.id, function (err, blob){
                blob.update({
                  name: name,
                  badge: badge,
                  dob: dob,
                  isloved: isloved
                }, function (err, blobID){
                  if(!err){
                    //response  //alternatively you can a add new view that shows success
                    res.format({
                      html: function(){
                        res.redirect('/blobs/' + blob._id); //go back to page
                      },
                      json: function(){
                        res.json(blob); //show updated vals
                      }
                    });
                  } else {
                    res.send("There was a problem updating the information to the database: " + err);
                  }
                })
              });
        })

      //delete
      router.delete('/:id/edit', function(req, res){
        //find by id
        mongoose.model('Blob').findById(req.id, function(err, blob){
          if(!err){
            console.log('DELETE removing ID: ' + blob._id);
            res.format({
              html: function(){
                res.redirect('/blobs');
              },
              json: function(){
                res.json({
                  message: 'deleted',
                  item: blob
                });
              }
            });
          } else {
            return console.error(err);
          }
        });
      });

      //export
      module.exports = router;
