const seasons = require("../../data/seasons.json");

module.exports = function (app, db, schemas) {
  const NBATeamRoster = db.model("NBATeamRosters", schemas.NBA.TeamRosterSchema);
  const NBAPlayer = db.model("NBAPlayers", schemas.NBA.PlayerSchema);

  app.get("/nba/teamrosters.json", function (req, res) {
    NBATeamRoster.find({})
      .lean()
      .then(function (rosters) {
        var personIds = rosters.map(function (roster) {
          return roster["PLAYER_ID"];
        });

        NBAPlayer.find({ personId: { $in: personIds } }).then(function (players) {
          for (i = 0; i < rosters.length; i++) {
            for (j = 0; j < players.length; j++) {
              if (rosters[i].PLAYER_ID == players[j].personId) {
                rosters[i].player = players[j];
              }
            }
          }

          res.json(rosters);
        });
      });
  });

  app.get("/nba/teamrosters", function (req, res) {
    query = {};
    filter = {};

    let page = {
      blocks: {
        NBAGames: {
          query: query,
          filter: filter,
          data: {
            static: {},
          },
          default_view: "NBAFranchisesView",
        },
      },
    };

    res.render("pages/teamrosters", { page: page, seasons: seasons });
  });
};
