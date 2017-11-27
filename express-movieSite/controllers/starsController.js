var Stars = require('../models/stars');
var async = require('async');
var Movie = require('../models/movie');
// Display list of all Genre
exports.stars_list = function(req, res, next) {
    
      Stars.find({}, 'first_name movies_starred')
        .populate('first_name')
        .exec(function (err, list_stars) {
          if (err) { return next(err); }
          //Successful, so render
          res.render('stars_list', { title: 'Stars List', stars_list: list_stars });
        });
        
    };
// Display detail page for a specific star
exports.stars_detail = function(req, res, next) {
    
      async.parallel({
        stars: function(callback) {     
          Stars.findById(req.params.id)
            .exec(callback);
        },
        stars_movie: function(callback) {
          Movie.find({ 'stars': req.params.id },'title description')
            .exec(callback);
        },
      }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('stars_detail', { title: 'Stars Detail', stars: results.stars, movie_stars: results.stars_movie });
      });
        
    };
// Display Stars create form on GET
exports.stars_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Stars create GET');
};

// Handle Stars create on POST
exports.stars_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Stars create POST');
};

// Display Stars delete form on GET
exports.stars_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: stars delete GET');
};

// Handle Stars delete on POST
exports.stars_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: stars delete POST');
};

// Display Stars update form on GET
exports.stars_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: stars update GET');
};

// Handle stars update on POST
exports.stars_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: stars update POST');
};