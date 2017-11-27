var Stars = require('../models/stars');
var async = require('async');
var Movie = require('../models/movie');
// Display list of all Genre
exports.stars_list = function(req, res, next) {
    
      Stars.find()
        .sort([['first_name', 'ascending']])
        .exec(function (err, list_stars) {
          if (err) { return next(err); }
          //Successful, so render
          res.render('stars_list', { title: 'stars List', list_stars:  list_stars});
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
exports.stars_create_get = function(req, res, next) {       
    res.render('stars_form', { title: 'Create Star'});
};

// Handle Stars create on POST
exports.stars_create_post = function(req, res, next) {
    
     req.checkBody('first_name', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
     req.checkBody('second_name', 'second name must be specified.').notEmpty();
     req.checkBody('date_of_birth', 'Invalid date').notEmpty();
     req.checkBody('date_of_death', 'Invalid date').optional();
     req.checkBody('nationality', 'nationality must be specified.').notEmpty();
     
     req.sanitize('first_name').escape();
     req.sanitize('second_name').escape();
     req.sanitize('first_name').trim();     
     req.sanitize('second_name').trim();
     req.sanitize('date_of_birth').toDate();
     req.sanitize('date_of_death').toDate();
     req.sanitize('nationality').escape();
     req.sanitize('nationality').trim();  

 
     var errors = req.validationErrors();
     
     var stars = new Stars(
       { first_name: req.body.first_name, 
         second_name: req.body.second_name, 
         date_of_birth: req.body.date_of_birth,
         date_of_death: req.body.date_of_death,
         nationality: req.body.nationality
        });
        
     if (errors) {
         res.render('stars_form', { title: 'Create Star', stars: stars, errors: errors});
     return;
     } 
     else {
     // Data from form is valid
     
         stars.save(function (err) {
             if (err) { return next(err); }
                //successful - redirect to new author record.
                res.redirect(stars.url);
             });
     }
 
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