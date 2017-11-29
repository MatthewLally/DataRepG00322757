var Stars = require('../models/stars');
var async = require('async');
var Movie = require('../models/movie');
// Display list of all Authors
exports.stars_list = function(req, res, next) {
    
      Stars.find()
        .sort([['second_name', 'ascending']])
        .exec(function (err, list_stars) {
          if (err) { return next(err); }
          //Successful, so render
          res.render('stars_list', { title: 'Stars List', star_list:  list_stars});
        })
    
    };
    
    // Display detail page for a specific Author
    exports.stars_detail = function(req, res, next) {
    
        async.parallel({
            star: function(callback) {
                Stars.findById(req.params.id)
                  .exec(callback)
            },
            stars_movies: function(callback) {
              Movie.find({ 'stars': req.params.id },'title description')
              .exec(callback)
            },
        }, function(err, results) {
            if (err) { return next(err); }
            //Successful, so render
    
            res.render('stars_detail', { title: 'Stars Detail', star: results.star, star_movies: results.stars_movies } );
        });
    
    };
    
    // Display Author create form on GET
    exports.stars_create_get = function(req, res, next) {
        res.render('stars_form', { title: 'Create Stars'});
    };
    
    // Handle Author create on POST
    exports.stars_create_post = function(req, res, next) {
    
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
    
        var star = new Stars(
          { first_name: req.body.first_name,
            second_name: req.body.second_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            nationality: req.body.nationality
           });
    
        if (errors) {
            res.render('stars_form', { title: 'Create Stars', star: star, errors: errors});
        return;
        }
        else {
        // Data from form is valid
    
            star.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new author record.
                   res.redirect(star.url);
                });
    
        }
    
    };
    
    // Display Author delete form on GET
    exports.stars_delete_get = function(req, res, next) {
    
        async.parallel({
            star: function(callback) {
                Stars.findById(req.params.id).exec(callback)
            },
            stars_movies: function(callback) {
              Movie.find({ 'stars': req.params.id }).exec(callback)
            },
        }, function(err, results) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('stars_delete', { title: 'Delete stars', star: results.star, star_movies: results.stars_movies } );
        });
    
    };
    
    // Handle Author delete on POST
    exports.stars_delete_post = function(req, res, next) {
    
        req.checkBody('starid', 'Star id must exist').notEmpty();
    
        async.parallel({
            star: function(callback) {
              Stars.findById(req.body.starid).exec(callback)
            },
            stars_movies: function(callback) {
              Movie.find({ 'stars': req.body.starid }).exec(callback)
            },
        }, function(err, results) {
            if (err) { return next(err); }
            //Success
            if (results.stars_movies.length > 0) {
                //Author has books. Render in same way as for GET route.
                res.render('stars_delete', { title: 'Delete Star', star: results.star, star_movies: results.stars_movies } );
                return;
            }
            else {
                //Author has no books. Delete object and redirect to the list of authors.
                Stars.findByIdAndRemove(req.body.starid, function deleteStars(err) {
                    if (err) { return next(err); }
                    //Success - got to author list
                    res.redirect('/main/stars')
                })
    
            }
        });
    
    };
    
    // Display Author update form on GET
    exports.stars_update_get = function(req, res, next) {
        
            req.sanitize('id').escape();
            req.sanitize('id').trim();
            Stars.findById(req.params.id, function(err, star) {
                if (err) { return next(err); }
                //On success
                res.render('stars_form', { title: 'Update Star', star: star });
        
            });
        };
        
        // Handle Author update on POST
        exports.stars_update_post = function(req, res, next) {
        
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
            var star = new Stars(
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
                res.render('stars_form', { title: 'Update Stars', star: star, errors: errors});
            return;
            }
            else {
                // Data from form is valid. Update the record.
                Stars.findByIdAndUpdate(req.params.id, star, {}, function (err,thestar) {
                    if (err) { return next(err); }
                       //successful - redirect to genre detail page.
                       res.redirect(thestar.url);
                    });
            }
        
        
        };
