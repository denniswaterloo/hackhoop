const mongoose = require("mongoose");

let FranchiseSchema = new mongoose.Schema({
  leagues: [],
  currentTeamFullName: String,
  currentTeamAcronym: String,
  historicalTeamAcronyms: [],
  historicalTeamNames: [],
});

module.exports = FranchiseSchema;
