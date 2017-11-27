var Movie = require('../models/movie');
var Director = require('../models/director');
var Genre = require('../models/genre');
var Stars = require('../models/stars');

var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        movie_count: function(callback) {
            Movie.count(callback);
        },
        Director_count: function(callback) {
            Director.count(callback);
        },
        stars_count: function(callback) {
            Stars.count(callback);
        },
        genre_count: function(callback) {
            Genre.count(callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Movies Database Home', error: err, data: results });
    });
};

// Display list of all Books
exports.movie_list = function(req, res, next) {
    
      Movie.find({}, 'title director')
        .populate('director')
        .exec(function (err, list_movies) {
          if (err) { return next(err); }
          //Successful, so render
          res.render('movie_list', { title: 'Movie List', movie_list: list_movies });
        });
        
    };

// Display detail page for a specific movie
// Display detail page for a specific book
exports.movie_detail = function(req, res, next) {
    
      async.parallel({
        movie: function(callback) {     
            
          Movie.findById(req.params.id)
            //.populate('director')
            .populate('genre')
            .exec(callback);
        },
        
      }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('movie_detail', { title: 'Title', movie: results.movie});
      });
    };
        

// Display movie create form on GET
exports.movie_create_get = function(req, res, next) { 
    
  //Get all authors and genres, which we can use for adding to our book.
  async.parallel({
      stars: function(callback) {
          Stars.find(callback);
      },

      directors: function(callback){
          Director.find(callback)
      },
      genres: function(callback) {
          Genre.find(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      res.render('movie_form', { title: 'Create Movie', stars: results.stars, directors: results.directors, genres: results.genres });
  });
  
};

// Handle movie create on POST
exports.movie_create_post = function(req, res, next) {
    
        req.checkBody('title', 'Title must not be empty.').notEmpty();
        req.checkBody('director', 'Author must not be empty').optional();
        req.checkBody('description', 'description must not be empty').notEmpty();
        req.checkBody('release_date', 'Invalid date').notEmpty();
       // req.checkBody('stars', 'star must not be empty').notEmpty();
        
        req.sanitize('title').escape();
        req.sanitize('director').escape();
        req.sanitize('description').escape();
        req.sanitize('release_date').toDate();
        req.sanitize('stars').escape();
        req.sanitize('title').trim();     
        req.sanitize('director').trim();
        req.sanitize('description').trim();
        req.sanitize('stars').trim();
        //req.sanitize('genre').escape();
        
        var movie = new Movie({
            title: req.body.title, 
            director: req.body.director, 
            description: req.body.description,
            release_date: req.body.release_date,
            //stars: req.body.stars,
            //genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre.split(",")
        });
           
        console.log('Movie: ' + movie);
        
        var errors = req.validationErrors();
        if (errors) {
            // Some problems so we need to re-render our book
    
            //Get all authors and genres for form
            async.parallel({
                stars: function(callback) {
                    Stars.find(callback);
                },
                directors: function(callback){
                    Director.find(callback)
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                
                // Mark our selected genres as checked
               // for (i = 0; i < results.genres.length; i++) {
                 //   if (movie.genre.indexOf(results.genres[i]._id) > -1) {
                        //Current genre is selected. Set "checked" flag.
                   //     results.genres[i].checked='true';
                    //}
                //}
    
                res.render('movie_form', { title: 'Create Movie',stars:results.stars, director:results.director, genres:results.genres, movie: movie, errors: errors });
            });
    
        } 
        else {
        // Data from form is valid.
        // We could check if book exists already, but lets just save.
        
            movie.save(function (err) {
                if (err) { return next(err); }
                //successful - redirect to new book record.
                res.redirect(movie.url);
            });
        }
    
    };

// Display movie delete form on GET
exports.movie_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Movie delete GET');
};

// Handle movie delete on POST
exports.movie_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Movie delete POST');
};

// Display movie update form on GET
exports.movie_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Movie update GET');
};

// Handle movie update on POST
exports.movie_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Movie update POST');
};