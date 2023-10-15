module.exports = function (app, db, schemas) {
  const NBAFranchise = db.model("NBAFranchises", schemas.NBA.FranchiseSchema);
  const teamsJSON = require("../../data/teams.json");

  app.get("/nba/franchises.json", function (req, res) {
    NBAFranchise.find({}).then(function (nbafranchises) {
      res.json(nbafranchises);
    });
  });

  app.get("/nba/franchises", function (req, res) {
    NBAFranchise.find({}).then(function (nbafranchises) {
      page = {};

      res.render("pages/franchises", { page: page, teamsJSON: teamsJSON });
    });
  });
};
