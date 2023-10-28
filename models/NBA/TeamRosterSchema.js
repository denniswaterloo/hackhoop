var mongoose = require("mongoose");

var TeamRosterSchema = new mongoose.Schema({
  teamID: Number,
  season: String,
  leagueID: String,
  playerName: String,
  playerNickname: String,
  playerSlug: String,
  jerseyNumber: String,
  playerPosition: String,
  height: String,
  weight: String,
  birthDate: String,
  age: Number,
  experience: String,
  school: String,
  playerId: Number,
  howAcquired: String,
});

module.exports = TeamRosterSchema;
