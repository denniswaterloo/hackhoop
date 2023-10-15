const mongoose = require("mongoose");

let GameSchema = new mongoose.Schema({
  gameId: { type: String, unique: true, required: true },
  leagueId: String,
  seasonYear: String,
  seasonType: String,
  period: Number,
  homeTeam: {},
  awayTeam: {},
  gameStatus: Number,
  gameStatusText: String,
  gameState: Number,
  gameTimeEastern: String,
  gameTimeUtc: String,

  gameStamp: String,
  dateString: String,
  timeString: String,
  dateStamp: Number,
  dateTimeStamp: Number,
  timeStamp: Number,
  yearNumber: Number,
  monthNumber: Number,
  monthStringLong: String,
  monthStringShort: String,
  dayNumber: Number,
  weekdayNumber: Number,
  weekdayStringShort: String,
  weekdayStringLong: String,
  seasonString: String,
  seasonStartYear: Number,
  seasonEndYear: Number,

  totalPoints: Number,
  pointsDiff: Number,
  winningTeamAcronym: String,
  losingTeamAcronym: String,
  winningTeamHomeOrAway: String,
  losingTeamHomeOrAway: String,

  arena: {},
  officials: {},
  attendance: Number,
  sellout: Number,
  exerpt: String,
  seriesGameNumber: String,
  seriesText: String,
  duration: String,
  gameCode: String,
});

module.exports = GameSchema;