var mongoose = require("mongoose");

var PlayerAwardSchema = new mongoose.Schema({
  playerAwardStamp: { type: String, unique: true, required: true },
  personId: Number,
  firstName: String,
  lastName: String,
  teamFullName: String,
  description: String,
  allNBATeamNumber: String,
  season: String,
  monthString: String,
  weekString: String,
  conference: String,
  type: String,
  subType1: String,
  subType2: String,
  subType3: String,
});

module.exports = PlayerAwardSchema;
