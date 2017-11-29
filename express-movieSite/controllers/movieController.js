var Movie = require('../models/movie');
var Stars = require('../models/stars');
var Genre = require('../models/genre');
var Director = require('../models/director');

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        movie_count: function(callback) {
            Movie.count(callback);
        },
        director_count: function(callback) {
            Director.count(callback);
        },
        star_count: function(callback) {
            Stars.count(callback);
        },
        genre_count: function(callback) {
            Genre.count(callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Movie Database Home', error: err, data: results });
    });
};


// Display list of all movies
exports.movie_list = function(req, res, next) {

  Movie.find({}, 'title star ')
    .populate('Stars')
    .exec(function (err, list_movies) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('movie_list', { title: 'Movie List', movie_list:  list_movies});
    });

};

// Display detail page for a specific movie
exports.movie_detail = function(req, res, next) {
    
        async.parallel({
            movie: function(callback) {
    
                Movie.findById(req.params.id)
                  .populate('stars')
                  .populate('genre')
                  .exec(callback);
            },
            director: function(callback) {
    
              Director.find({ 'first_name': req.params.id })
              .exec(callback);
            },

            star: function(callback) {
                
                          Stars.find({ 'first_name': req.params.id })
                          .exec(callback);
                        },
        }, function(err, results) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('movie_detail', { title: 'Title', movie:  results.movie, director: results.director, star: results.star } );
        });
    
    };
    

// Display movie create form on GET
exports.movie_create_get = function(req, res, next) {

    //Get all movie info, which we can use for adding to our movie.
    async.parallel({
        directors: function(callback){
            Director.find(callback)
        },
        stars: function(callback) {
            Stars.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('movie_form', { title: 'Create Movie',stars:results.stars, genres:results.genres, directors:results.directors });
    });

};

// Handle movie create on POST
exports.movie_create_post = function(req, res, next) {

    req.checkBody('title', 'Title must not be empty.').notEmpty();
    req.checkBody('director', 'Director must not be empty.').notEmpty();
    req.checkBody('description', 'Description must not be empty.').notEmpty();
    req.checkBody('release_date', 'Release date must not be empty.').notEmpty();
    req.checkBody('stars', 'Stars must not be empty.').notEmpty();


    req.sanitize('title').escape();
    req.sanitize('director').escape();
    req.sanitize('description').escape();
    req.sanitize('release_date').toDate();
    req.sanitize('stars').escape();
    req.sanitize('title').trim();
    req.sanitize('director').trim();
    req.sanitize('description').trim();
    req.sanitize('stars').trim();
    req.sanitize('genre').escape();

    var movie = new Movie(
      { title: req.body.title,
        director: req.body.director,
        description: req.body.description,
        release_date: req.body.release_date,
        stars: req.body.stars,
        genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre.split(",")
       });

    console.log('Movie: '+movie);

    var errors = req.validationErrors();
    if (errors) {
        // Some problems so we need to re-render our movie
        console.log('GENRE: '+req.body.genre);

        console.log('ERRORS: '+errors);
        //Get all movie info
        async.parallel({
            stars: function(callback) {
                Stars.find(callback);
            },
            director: function(callback) {
                Director.find(callback);
            },
            genres: function(callback) {
                Genre.find(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); }

            // Mark our selected genres as checked
            for (i = 0; i < results.genres.length; i++) {
                if (movie.genre.indexOf(results.genres[i]._id) > -1) {
                    //console.log('IS_IN_GENRES: '+results.genres[i].name);
                    results.genres[i].checked='true';
                    //console.log('ADDED: '+results.genres[i]);
                }
            }

            res.render('movie_form', { title: 'Create Movie',stars:results.stars, genres:results.genres, directors:results.directors, movie: movie, errors: errors });
        });

    }
    else {
    // Data from form is valid.

        movie.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to new movie record.
               res.redirect(movie.url);
            });
    }

};

// Display movie delete form on GET
exports.movie_delete_get = function(req, res, next) {

    async.parallel({
        movie: function(callback) {
            Movie.findById(req.params.id).populate('Stars').populate('Genre').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('movie_delete', { title: 'Delete Movie', movie: results.movie} );
    });

};

// Handle movie delete on POST
exports.movie_delete_post = function(req, res, next) {

    

    async.parallel({
        movie: function(callback) {
            Movie.findById(req.params.id).populate('Stars').populate('Genre').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.movie.length < 0) {
            //if there are no movies throw error
            res.render('movie_delete', { title: 'Delete Movie', movie: results.movie} );
            return;
        }
        else {
            //movie can be deleted
            Movie.findByIdAndRemove(req.body.id, function deleteMovie(err) {
                if (err) { return next(err); }
                //Success - got to movie list
                res.redirect('/main/movie');
            });

        }
    });

};

// Display movie update form on GET
exports.movie_update_get = function(req, res, next) {

    req.sanitize('id').escape();
    req.sanitize('id').trim();

    //Get movie info
    async.parallel({
        movie: function(callback) {
            Movie.findById(req.params.id).populate('director').populate('genre').populate('stars').exec(callback);
        },
        directors: function(callback) {
            Director.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
        stars: function(callback){
            Stars.find(callback)
        }
        }, function(err, results) {
            if (err) { return next(err); }

            // Mark our selected genres as checked
            for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
                for (var movie_g_iter = 0; movie_g_iter < results.movie.genre.length; movie_g_iter++) {
                    if (results.genres[all_g_iter]._id.toString()==results.movie.genre[movie_g_iter]._id.toString()) {
                        results.genres[all_g_iter].checked='true';
                    }
                }
            }
            res.render('movie_form', { title: 'Update Movie', directors:results.directors, genres:results.genres, stars:results.stars, movie: results.movie});
        });

};

// Handle movie update on POST
exports.movie_update_post = function(req, res, next) {

    req.checkBody('title', 'Title must not be empty.').notEmpty();
    req.checkBody('director', 'Director must not be empty.').notEmpty();
    req.checkBody('description', 'Description must not be empty.').notEmpty();
    req.checkBody('release_date', 'Release date must not be empty.').notEmpty();
    req.checkBody('stars', 'Stars must not be empty.').notEmpty();


    req.sanitize('title').escape();
    req.sanitize('director').escape();
    req.sanitize('description').escape();
    req.sanitize('release_date').toDate();
    req.sanitize('stars').escape();
    req.sanitize('title').trim();
    req.sanitize('director').trim();
    req.sanitize('description').trim();
    req.sanitize('stars').trim();
    req.sanitize('genre').escape();

    var movie = new Movie(
      { title: req.body.title,
        director: req.body.director,
        description: req.body.description,
        release_date: req.body.release_date,
        stars: req.body.stars,
        genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre.split(","),
        _id:req.params.id
       });

    var errors = req.validationErrors();
    if (errors) {
        // Re-render movie with error information
        // Get all movie info
        async.parallel({
            directors: function(callback) {
                Director.find(callback);
            },
            genres: function(callback) {
                Genre.find(callback);
            },
            stars: function(callback) {
                Stars.find(callback)
            }
        }, function(err, results) {
            if (err) { return next(err); }

            // Mark our selected genres as checked
            for (i = 0; i < results.genres.length; i++) {
                if (movie.genre.indexOf(results.genres[i]._id) > -1) {
                    results.genres[i].checked='true';
                }
            }
            res.render('movie_form', { title: 'Update Movie',directors:results.directors, genres:results.genres, stars:results.stars, movie: movie, errors: errors });
        });

    }
    else {
        // Data from form is valid. Update the record.
        Movie.findByIdAndUpdate(req.params.id, movie, {}, function (err,movie) {
            if (err) { return next(err); }
               //successful - redirect to movie detail page.
               res.redirect(themovie.url);
            });
    }

};