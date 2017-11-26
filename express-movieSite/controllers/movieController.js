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
exports.movie_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Movie detail: ' + req.params.id);
};

// Display movie create form on GET
exports.movie_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Movie create GET');
};

// Handle movie create on POST
exports.movie_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Movie create POST');
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