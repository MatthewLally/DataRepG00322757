var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DirectorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    second_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
    nationality: {type: String, required: true, max: 100},
    movies_directed: { type: Schema.ObjectId, ref: 'Movie'},
  }
);

// Virtual for director's full name
DirectorSchema
.virtual('name')
.get(function () {
  return this.second_name + ', ' + this.first_name;
});

// Virtual for Director's URL
DirectorSchema
.virtual('url')
.get(function () {
  return '/catalog/director/' + this._id;
});

//Export model
module.exports = mongoose.model('Director', DirectorSchema);