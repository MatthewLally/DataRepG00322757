var Director = require('../models/director');
var async = require('async');
var Movie = require('../models/movie');

// Display list of all Directors
// Display list of all Books
exports.director_list = function(req, res, next) {
    
      Director.find({}, 'first_name movies_directed')
        .populate('first_name')
        .exec(function (err, list_director) {
          if (err) { return next(err); }
          //Successful, so render
          res.render('director_list', { title: 'Director List', director_list: list_director });
        });
        
    };
// Display detail page for a specific Director
exports.director_detail = function(req, res, next) {
    
      async.parallel({
        director: function(callback) {     
          Director.findById(req.params.id)
            .exec(callback);
        },
        director_movie: function(callback) {
          Movie.find({ 'director': req.params.id },'title description')
            .exec(callback);
        },
      }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('director_detail', { title: 'Director Detail', director: results.director, movie_director: results.director_movie });
      });
        
    };
// Display Director create form on GET
exports.director_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Director create GET');
};

// Handle Director create on POST
exports.director_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Director create POST');
};

// Display Direcor delete form on GET
exports.director_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Director delete GET');
};

// Handle Director delete on POST
exports.director_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Director delete POST');
};

// Display Director update form on GET
exports.director_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Director update GET');
};

// Handle Director update on POST
exports.director_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Director update POST');
};