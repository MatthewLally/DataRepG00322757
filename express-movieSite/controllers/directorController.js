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
exports.director_create_get = function(req, res, next) {       
    res.render('director_form', { title: 'Create Director'});
};

// Handle Stars create on POST
exports.director_create_post = function(req, res, next) {
    
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
     
     var director = new Director(
       { first_name: req.body.first_name, 
         second_name: req.body.second_name, 
         date_of_birth: req.body.date_of_birth,
         date_of_death: req.body.date_of_death,
         nationality: req.body.nationality
        });
        
     if (errors) {
         res.render('director_form', { title: 'Create Director', director: director, errors: errors});
     return;
     } 
     else {
     // Data from form is valid
     
         director.save(function (err) {
             if (err) { return next(err); }
                //successful - redirect to new author record.
                res.redirect(director.url);
             });
     }
 
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