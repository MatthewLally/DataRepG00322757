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


// Display list of all books
exports.movie_list = function(req, res, next) {

  Movie.find({}, 'title star ')
    .populate('Stars')
    .exec(function (err, list_movies) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('movie_list', { title: 'Movie List', movie_list:  list_movies});
    });

};

// Display detail page for a specific book
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
              //.populate('book')
              .exec(callback);
            },

            star: function(callback) {
                
                          Stars.find({ 'first_name': req.params.id })
                          //.populate('book')
                          .exec(callback);
                        },
        }, function(err, results) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('movie_detail', { title: 'Title', movie:  results.movie, director: results.director, star: results.star } );
        });
    
    };
    

// Display book create form on GET
exports.movie_create_get = function(req, res, next) {

    //Get all authors and genres, which we can use for adding to our book.
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

// Handle book create on POST
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
        // Some problems so we need to re-render our book
        console.log('GENRE: '+req.body.genre);

        console.log('ERRORS: '+errors);
        //Get all authors and genres for form
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
    // We could check if book exists already, but lets just save.

        movie.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to new book record.
               res.redirect(movie.url);
            });
    }

};

// Display book delete form on GET
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

// Handle book delete on POST
exports.movie_delete_post = function(req, res, next) {

    //Assume the post will have id (ie no checking or sanitisation).

    async.parallel({
        movie: function(callback) {
            Movie.findById(req.params.id).populate('Stars').populate('Genre').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.movie.length < 0) {
            //Book has book_instances. Render in same way as for GET route.
            res.render('movie_delete', { title: 'Delete Movie', movie: results.movie} );
            return;
        }
        else {
            //Book has no bookinstances. Delete object and redirect to the list of books.
            Movie.findByIdAndRemove(req.body.id, function deleteMovie(err) {
                if (err) { return next(err); }
                //Success - got to books list
                res.redirect('/main/movie');
            });

        }
    });

};

// Display book update form on GET
exports.movie_update_get = function(req, res, next) {

    req.sanitize('id').escape();
    req.sanitize('id').trim();

    //Get book, authors and genres for form
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

// Handle book update on POST
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
        // Re-render book with error information
        // Get all authors and genres for form
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
               //successful - redirect to book detail page.
               res.redirect(themovie.url);
            });
    }

};