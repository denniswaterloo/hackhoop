const mongoose = require("mongoose");

let FranchiseSchema = new mongoose.Schema({
  leagues: [],
  status: String,
  currentTeamFullName: String,
  currentTeamAcronym: String,
  historicalTeamAcronyms: [],
  historicalTeamNames: [],
  seasons: {},
});

module.exports = FranchiseSchema;
