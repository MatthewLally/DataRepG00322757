var express = require('express');
var router = express.Router();

// Require controller modules
var movie_controller = require('../controllers/movieController');
var stars_controller = require('../controllers/starsController');
var director_controller = require('../controllers/directorController');
var genre_controller = require('../controllers/genreController');

/// BOOK ROUTES ///

/* GET cmain home page. */
router.get('/', movie_controller.index);

/* GET request for creating a Movie. NOTE This must come before routes that display movie (uses id) */
router.get('/movie/create', movie_controller.movie_create_get);

/* POST request for creating a movie. */
router.post('/movie/create', movie_controller.movie_create_post);

/* GET request to delete a movie. */
router.get('/movie/:id/delete', movie_controller.movie_delete_get);

// POST request to delete a movie
router.post('/movie/:id/delete', movie_controller.movie_delete_post);

/* GET request to update movie. */
router.get('/movie/:id/update', movie_controller.movie_update_get);

// POST request to update a movie
router.post('/movie/:id/update', movie_controller.movie_update_post);

/* GET request for one movie. */
router.get('/movie/:id', movie_controller.movie_detail);

/* GET request for list of all movie items. */
router.get('/movie', movie_controller.movie_list);

/// Stars ROUTES ///

/* GET request for creating stars. NOTE This must come before route for id (i.e. display stars) */
router.get('/stars/create', stars_controller.stars_create_get);

/* POST request for creating stars. */
router.post('/stars/create', stars_controller.stars_create_post);

/* GET request to delete stars. */
router.get('/stars/:id/delete', stars_controller.stars_delete_get);

// POST request to delete stars
router.post('/stars/:id/delete', stars_controller.stars_delete_post);

/* GET request to update stars. */
router.get('/stars/:id/update', stars_controller.stars_update_get);

// POST request to update stars
router.post('/stars/:id/update', stars_controller.stars_update_post);

/* GET request for one star. */
router.get('/stars/:id', stars_controller.stars_detail);

/* GET request for list of all stars. */
router.get('/stars', stars_controller.stars_list);

/// GENRE ROUTES ///

/* GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id) */
router.get('/genre/create', genre_controller.genre_create_get);

/* POST request for creating Genre. */
router.post('/genre/create', genre_controller.genre_create_post);

/* GET request to delete Genre. */
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

/* GET request to update Genre. */
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre
router.post('/genre/:id/update', genre_controller.genre_update_post);

/* GET request for one Genre. */
router.get('/genre/:id', genre_controller.genre_detail);

/* GET request for list of all Genre. */
router.get('/genres', genre_controller.genre_list);

/// Director ROUTES ///

/* GET request for creating a Director. NOTE This must come before route that displays Director (uses id) */
router.get('/director/create', director_controller.director_create_get);

/* POST request for creating director. */
router.post('/director/create', director_controller.director_create_post);

/* GET request to delete a director. */
router.get('/director/:id/delete', director_controller.director_delete_get);

// POST request to delete director
router.post('/director/:id/delete', director_controller.director_delete_post);

/* GET request to update director. */
router.get('/director/:id/update', director_controller.director_update_get);

// POST request to update director
router.post('/director/:id/update', director_controller.director_update_post);

/* GET request for one director. */
router.get('/director/:id', director_controller.director_detail);

/* GET request for list of all directors. */
router.get('/director', director_controller.director_list);

module.exports = router;