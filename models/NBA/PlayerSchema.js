var mongoose = require("mongoose");

var PlayerSchema = new mongoose.Schema({
  personId: { type: Number, unique: true, required: true },
  playerLastName: String,
  playerFirstName: String,
  playerSlug: String,
  jerseyNumber: String,
  position: String,
  heightFt: String,
  college: String,
  country: String,
  draftYear: Number,
  draftRound: Number,
  draftNumber: Number,
});

module.exports = PlayerSchema;
