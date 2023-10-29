var mongoose = require("mongoose");

var TeamStatSchema = new mongoose.Schema({
  gameId: String,
  gameStamp: String,
  gameCode: String,

  dateStamp: Number,

  monthStringLong: String,
  monthStringShort: String,
  monthNumber: Number,

  period: Number,
  gameTimeUTC: String,
  gameEt: String,

  seasonType: String,
  seasonYearString: String,

  teamId: Number,

  teamStamp: String,

  teamTricode: String,

  teamName: String,
  teamCity: String,
  teamWins: Number,
  teamLosses: Number,
  teamScore: Number,

  awayOrHome: String,

  entireGame: {},
  firstQuarter: {},
  secondQuarter: {},
  thirdQuarter: {},
  fourthQuarter: {},

  firstHalf: {},
  secondHalf: {},

  overTimeAll: {},

  overTimeOne: {},
  overTimeTwo: {},
  overTimeThree: {},
  overTimeFour: {},
  overTimeFive: {},
  overTimeSix: {},
  overTimeSeven: {},
  overTimeEight: {},
  overTimeNine: {},
  overTimeTen: {},
});

module.exports = TeamStatSchema;
