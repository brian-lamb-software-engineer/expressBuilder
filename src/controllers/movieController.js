// movies controller
// includes all crud operations
// rest calls can respond via

/**
{"Title":"Oblivion","Year":"2013","Rated":"PG-13","Released":"19 Apr 2013","Runtime":"124 min","Genre":"Action, Adventure, Mystery","Director":"Joseph Kosinski","Writer":"Karl Gajdusek (screenplay), Michael Arndt (screenplay), Joseph Kosinski (graphic novel original story)","Actors":"Tom Cruise, Morgan Freeman, Olga Kurylenko, Andrea Riseborough","Plot":"A veteran assigned to extract Earth's remaining resources begins to question what he knows about his mission and himself.","Language":"English","Country":"USA","Awards":"11 nominations.","Poster":"http://ia.media-imdb.com/images/M/MV5BMTQwMDY0MTA4MF5BMl5BanBnXkFtZTcwNzI3MDgxOQ@@._V1_SX300.jpg","Metascore":"54","imdbRating":"7.0","imdbVotes":"351,549","imdbID":"tt1483013","Type":"movie","Response":"True"}
*/
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
//build the REST operations at the base for movies
router.route('/').get(function(req, res, next) {
    // @todo enable paginate /:page?*
    // var resultLimit = 10,
      // page = req.param('page') >= 0 ? req.param('page') : 1;

      mongoose.model('Movie')
        .find()
        //.select('name')
        .limit(100)
        .skip(20) //as demo, incidentally they have ugly names
        .sort({name: 'asc'})
        .exec(function(err, movies) {
          if(!err){
            //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
            res.format({
              html: function(){
                //req param page should be available (movie._page)
                res.render('movies/index', {
                  title: 'All movies',
                  "movies": movies
                });
              },
              json: function(){
                res.json(infophotos);
              }
            })
          } else {
            return  console.error(err);
          }
        })
    })
    .post( function(req, res){
      //get vals from post, via forms or api calls
      //relys on name attr of form
      var name = req.body.name,
          length = req.body.length,
          starring = req.body.starring,
          year = req.body.year,
          notes = req.body.notes;
          retail = req.body.retail;
          mongoose.model('Movie').create({
            name: name,
            length: length,
            starring: starring,
            year: year,
            notes: notes,
            retail: retail
          }, function (err, movie) {
            if (!err){
              //movie was created
              console.log('New Movie');
              console.log(movie);
              res.format({
                html: function(){
                  res.location('movies'); //set address bar loc
                  res.redirect('/movies'); //success page forward
                },
                json: function(){
                  res.json(movie);
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
      res.render('movies/new', { title: 'Add new Movie' });
    });

    //route this middleware to check id first
    router.param('id', function(req, res, next, id){
      mongoose.model('Movie').findById(id, function(err, movie){
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

    //get movie by id, for display
    router.route('/:id')
      .get(function(req, res) {
        mongoose.model('Movie').findById(req.id, function(err, movie){
          if(!err){
            console.log('GET Retrieving ID: ' + movie._id);
            var insertedFormatted = movie.inserted.toISOString();
            insertedFormatted = insertedFormatted.substring(0, insertedFormatted.indexOf('T'));
            res.format({
              html: function(){
                res.render('movies/show', {
                  'inserted' : insertedFormatted,
                  'movie' : movie
                });
              },
              json: function(){
                res.json(movie);
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
          mongoose.model('Movie').findById(req.id, function(err, movie){
            if(!err){
              console.log('GET Retrieving ID: ' + movie._id);
              var insertedFormatted = movie.inserted.toISOString();
              insertedFormatted = insertedFormatted.substring(0, insertedFormatted.indexOf('T'));
              res.format({
                html: function(){
                  res.render('movies/edit', {
                    title: 'Movie' + movie._id,
                    "inserted": insertedFormatted,
                    "movie": movie
                  })
                },
                json: function(){
                  res.json(movie);
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
            length = req.body.length,
            starring = req.body.starring,
            year = req.body.year,
            notes = req.body.notes,
            retail = req.body.retail;

          mongoose.model('Movie').findById(req.id, function (err, movie){
            movie.update({
              name: name,
              length: length,
              starring: starring,
              year: year,
              notes: notes,
              retail: retail
            }, function (err, movieID){
              if(!err){
                //response  //alternatively you can a add new view that shows success
                res.format({
                  html: function(){
                    res.redirect('/movies/' + movie._id); //go back to page
                  },
                  json: function(){
                    res.json(movie); //show updated vals
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
        mongoose.model('Movie').findById(req.id, function(err, movie){
          if(!err){
            console.log('DELETE removing ID: ' + movie._id);
            res.format({
              html: function(){
                res.redirect('/movies');
              },
              json: function(){
                res.json({
                  message: 'deleted',
                  item: movie
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
