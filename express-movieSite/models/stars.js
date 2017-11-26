var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StarsSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    second_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
    nationality: {type: String, required: true, max: 100},
    movies_starred: { type: Schema.ObjectId, ref: 'Movie'},
  }
);

// Virtual for director's full name
StarsSchema
.virtual('name')
.get(function () {
  return this.second_name + ', ' + this.first_name;
});

// Virtual for Director's URL
StarsSchema
.virtual('url')
.get(function () {
  return '/main/star/' + this._id;
});

//Export model
module.exports = mongoose.model('Stars', StarsSchema);