var Stars = require('../models/star');

// Display list of all Genre
exports.stars_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Stars list');
};

// Display detail page for a specific star
exports.stars_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Stars detail: ' + req.params.id);
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