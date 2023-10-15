const mongoose = require("mongoose");

let FranchiseSchema = new mongoose.Schema({
  leagues: [],
  currentTeamFullName: String,
  currentTeamAcronym: String,
  historicalTeamAcronyms: ["DEN", "DNA", "DNR"],
  historicalTeamNames: [],
});

module.exports = FranchiseSchema;
