var Genre = require('../models/genre');

var Movie = require('../models/movie');
var async = require('async');

// Display list of all Genre
exports.genre_list = function(req, res, next) {

  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genres) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('genre_list', { title: 'Genre List', genre_list:  list_genres});
    });

};
    // Display detail page for a specific Author
    exports.genre_detail = function(req, res, next) {
    
        async.parallel({
            genre: function(callback) {
                Genre.findById(req.params.id)
                  .exec(callback)
            },
            genre_movies: function(callback) {
              Movie.find({ 'genre': req.params.id },'title description')
              .exec(callback)
            },
        }, function(err, results) {
            if (err) { return next(err); }
            //Successful, so render
    
            res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_movies: results.genre_movies } );
        });
    
    };
    
    // Display Author create form on GET
    exports.genre_create_get = function(req, res, next) {
        res.render('genre_form', { title: 'Create Genre'});
    };
    
    // Handle Author create on POST
    exports.genre_create_post = function(req, res, next) {
    
        req.checkBody('name', 'name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.

        var errors = req.validationErrors();

        var genre = new Genre(
            { name: req.body.name }
          );
        if (errors) {
            res.render('genre_form', { title: 'Create Genre', Genre: Genre, errors: errors});
        return;
        }
        else {
        // Data from form is valid
    
            genre.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new author record.
                   res.redirect(genre.url);
                });
    
        }
    
    };
    
   // Display Genre delete form on GET
exports.genre_delete_get = function(req, res, next) {
    
        async.parallel({
            genre: function(callback) {
                Genre.findById(req.params.id).exec(callback);
            },
            genre_movies: function(callback) {
                Movie.find({ 'genre': req.params.id }).exec(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_movies: results.genre_movies } );
        });
    
    };
    
    // Handle Genre delete on POST
    exports.genre_delete_post = function(req, res, next) {
    
        req.checkBody('id', 'Genre id must exist').notEmpty();
    
        async.parallel({
            genre: function(callback) {
                Genre.findById(req.params.id).exec(callback);
            },
            genre_movies: function(callback) {
                Movie.find({ 'genre': req.params.id }).exec(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); }
            //Success
            if (results.genre_movies.length > 0) {
                //Genre has books. Render in same way as for GET route.
                res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_movies: results.genre_movies } );
                return;
            }
            else {
                //Genre has no books. Delete object and redirect to the list of genres.
                Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
                    if (err) { return next(err); }
                    //Success - got to genres list
                    res.redirect('/main/genre');
                });
    
            }
        });
    
    };
    
    
    // Display Author update form on GET
    exports.genre_update_get = function(req, res, next) {
    
        req.sanitize('id').escape();
        req.sanitize('id').trim();
        Genre.findById(req.params.id, function(err, genre) {
            if (err) { return next(err); }
            //On success
            res.render('genre_form', { title: 'Update genre', genre: genre });
    
        });
    };
    
    // Handle Author update on POST
    exports.genre_update_post = function(req, res, next) {
    
        req.sanitize('id').escape();
        req.sanitize('id').trim();
    
        req.checkBody('name', 'Genre name required').notEmpty();
    
        req.sanitize('name').escape();
    
        //Run the validators
        var errors = req.validationErrors();
    
        //Create a author object with escaped and trimmed data (and the old id!)
        var genre = new Genre(
            { name: req.body.name,
            _id:req.params.id }
          );
    
        if (errors) {
            //If there are errors render the form again, passing the previously entered values and errors
            res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err,thegenre) {
                if (err) { return next(err); }
                   //successful - redirect to genre detail page.
                   res.redirect(thegenre.url);
                });
        }
    
    
    };
