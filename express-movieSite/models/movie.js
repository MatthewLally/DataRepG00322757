var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MovieSchema = new Schema(
  {
    title: {type: String, required: true, max: 100},
    director: {type: Schema.ObjectId, ref: 'Director', required: true},
    description: {type: String, required: true, max: 100},
    release_date: {type: Date, required: true},
    stars : {type: Schema.ObjectId, ref: 'Stars', required: true},
    genre : { type: Schema.ObjectId, ref: 'Genre', required: true},
  }
);



// Virtual for author's URL
MovieSchema
.virtual('url')
.get(function () {
  return '/catalog/movie/' + this._id;
});

//Export model
module.exports = mongoose.model('Movie', MovieSchema);