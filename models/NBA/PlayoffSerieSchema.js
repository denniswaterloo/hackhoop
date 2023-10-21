var mongoose = require("mongoose");

let PlayoffSerieSchema = new mongoose.Schema({
  seriesId: { type: String, unique: true, required: true },
  seasonYear: String,
  gamesPlayed: Number,
  gameIds: [],
  games: [],
  homeAdvantageTeamId: Number,
  awayDisadvantageTeamId: Number,
  homeAdvantageTeamAcronym: String,
  awayDisadvantageTeamAcronym: String,
  homeAdvantageTeamName: String,
  awayDisadvantageTeamName: String,
  homeAdvantageTeamWins: Number,
  homeAdvantageTeamLosses: Number,
  awayDisadvantageTeamWins: Number,
  awayDisadvantageTeamLosses: Number,

  homeAdvantageTeamStandingSeedNumber: String,
  awayDisadvantageTeamStandingSeedNumber: String,
  homeAdvantageTeamPlayoffsPositionSeedNumber: String,
  awaydisadvantageTeamPlayoffsPositionSeedNumber: String,

  playoffRound: Number,
  playoffRoundName: String,
  playoffRoundNameShort: String,
  conference: String,
});

module.exports = PlayoffSerieSchema;
