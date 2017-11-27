var Director = require('../models/director');
var async = require('async');
var Movie = require('../models/movie');
// Display list of all Authors
exports.director_list = function(req, res, next) {
    
      Director.find()
        .sort([['second_name', 'ascending']])
        .exec(function (err, list_directors) {
          if (err) { return next(err); }
          //Successful, so render
          res.render('director_list', { title: 'Director List', director_list:  list_directors});
        })
    
    };
    
    // Display detail page for a specific Author
    exports.director_detail = function(req, res, next) {
    
        async.parallel({
            director: function(callback) {
                Director.findById(req.params.id)
                  .exec(callback)
            },
            directors_movies: function(callback) {
              Movie.find({ 'director': req.params.id },'title description')
              .exec(callback)
            },
        }, function(err, results) {
            if (err) { return next(err); }
            //Successful, so render
    
            res.render('director_detail', { title: 'Director Detail', director: results.director, director_movies: results.directors_movies } );
        });
    
    };
    
    // Display Author create form on GET
    exports.director_create_get = function(req, res, next) {
        res.render('director_form', { title: 'Create Directors'});
    };
    
    // Handle Author create on POST
    exports.director_create_post = function(req, res, next) {
    
        req.checkBody('first_name', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
        req.checkBody('second_name', 'Family name must be specified.').notEmpty();
        req.checkBody('date_of_birth', 'Invalid date').notEmpty();
        req.checkBody('date_of_death', 'Invalid date').optional();
        req.checkBody('nationality', 'nationality name must be specified.').notEmpty();
    
        req.sanitize('first_name').escape();
        req.sanitize('second_name').escape();
        req.sanitize('first_name').trim();
        req.sanitize('second_name').trim();
        req.sanitize('date_of_birth').toDate();
        req.sanitize('date_of_death').toDate();
    
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
    
    // Display Author delete form on GET
    exports.director_delete_get = function(req, res, next) {
    
        async.parallel({
            director: function(callback) {
                Director.findById(req.params.id).exec(callback)
            },
            directors_movies: function(callback) {
              Movie.find({ 'director': req.params.id }).exec(callback)
            },
        }, function(err, results) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('director_delete', { title: 'Delete director', director: results.director, director_movies: results.directors_movies } );
        });
    
    };
    
    // Handle Author delete on POST
    exports.director_delete_post = function(req, res, next) {
    
        req.checkBody('directorid', 'Director id must exist').notEmpty();
    
        async.parallel({
            director: function(callback) {
              Director.findById(req.body.directorid).exec(callback)
            },
            directors_movies: function(callback) {
              Movie.find({ 'director': req.body.directorid }).exec(callback)
            },
        }, function(err, results) {
            if (err) { return next(err); }
            //Success
            if (results.directors_movies.length > 0) {
                //Author has books. Render in same way as for GET route.
                res.render('director_delete', { title: 'Delete director', director: results.director, director_movies: results.directors_movies } );
                return;
            }
            else {
                //Author has no books. Delete object and redirect to the list of authors.
                Director.findByIdAndRemove(req.body.directorid, function deleteDirector(err) {
                    if (err) { return next(err); }
                    //Success - got to author list
                    res.redirect('/main/director')
                })
    
            }
        });
    
    };
    
    // Display Author update form on GET
    exports.director_update_get = function(req, res, next) {
    
        req.sanitize('id').escape();
        req.sanitize('id').trim();
        Stars.findById(req.params.id, function(err, director) {
            if (err) { return next(err); }
            //On success
            res.render('director_form', { title: 'Update director', director: director });
    
        });
    };
    
    // Handle Author update on POST
    exports.director_update_post = function(req, res, next) {
    
        req.sanitize('id').escape();
        req.sanitize('id').trim();
    
        req.checkBody('first_name', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
        req.checkBody('second_name', 'Family name must be specified.').notEmpty();
        req.checkBody('date_of_birth', 'Invalid date').notEmpty();
        req.checkBody('date_of_death', 'Invalid date').optional();
        req.checkBody('nationality', 'nationality name must be specified.').notEmpty();
    
        req.sanitize('first_name').escape();
        req.sanitize('second_name').escape();
        req.sanitize('first_name').trim();
        req.sanitize('second_name').trim();
        req.sanitize('date_of_birth').toDate();
        req.sanitize('date_of_death').toDate();
    
        //Run the validators
        var errors = req.validationErrors();
    
        //Create a author object with escaped and trimmed data (and the old id!)
        var director = new Director(
          {
          first_name: req.body.first_name,
          second_name: req.body.second_name,
          date_of_birth: req.body.date_of_birth,
          date_of_death: req.body.date_of_death,
          nationality: req.body.nationality,
          _id: req.params.id
          }
        );
    
        if (errors) {
            //If there are errors render the form again, passing the previously entered values and errors
            res.render('director_form', { title: 'Update Director', director: director, errors: errors});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Director.findByIdAndUpdate(req.params.id, star, {}, function (err,thedirector) {
                if (err) { return next(err); }
                   //successful - redirect to genre detail page.
                   res.redirect(thedirector.url);
                });
        }
    
    
    };
