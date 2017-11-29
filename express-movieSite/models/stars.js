var mongoose = require('mongoose');
var moment = require('moment'); //for date handling

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
  return '/main/stars/' + this._id;
});

StarsSchema
.virtual('lifespan')
.get(function () {
  var lifetime_string='';
  if (this.date_of_birth) {
      lifetime_string=moment(this.date_of_birth).format('MMMM Do, YYYY');
      }
  lifetime_string+=' - ';
  if (this.date_of_death) {
      lifetime_string+=moment(this.date_of_death).format('MMMM Do, YYYY');
      }
  return lifetime_string
});

StarsSchema
.virtual('date_of_birth_yyyy_mm_dd')
.get(function () {
  return moment(this.date_of_birth).format('YYYY-MM-DD');
});

StarsSchema
.virtual('date_of_death_yyyy_mm_dd')
.get(function () {
  return moment(this.date_of_death).format('YYYY-MM-DD');
});


//Export model
module.exports = mongoose.model('Stars', StarsSchema);