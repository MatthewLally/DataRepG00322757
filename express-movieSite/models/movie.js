var mongoose = require('mongoose');
var moment = require('moment'); //for date handling

var Schema = mongoose.Schema;

var MovieSchema = new Schema(
  {
    title: {type: String, required: true, max: 100},
    director: {type: Schema.ObjectId, ref: 'Director'},
    description: {type: String, required: true, max: 100},
    release_date: {type: Date, required: true},
    stars : {type: Schema.ObjectId, ref: 'Stars'},
    genre : { type: Schema.ObjectId, ref: 'Genre'},
  }
);



// Virtual for author's URL
MovieSchema
.virtual('url')
.get(function () {
  return '/main/movie/' + this._id;
});



MovieSchema
.virtual('release')
.get(function () {
  var release_string='';
  if (this.release_date) {
      release_string+moment(this.release_date).format('MMMM Do, YYYY');
      }
  return release_string
});

//Export model
module.exports = mongoose.model('Movie', MovieSchema);