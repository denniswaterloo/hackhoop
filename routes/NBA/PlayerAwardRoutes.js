module.exports = function (app, db, schemas) {
  const NBAPlayerAward = db.model("NBAPlayerAwards", schemas.NBA.PlayerAwardSchema);
  const NBAPlayer = db.model("NBAPlayers", schemas.NBA.PlayerSchema);

  const teamsJSON = require("../../data/teams.json");

  app.get("/nba/playerawards.json", function (req, res) {
    NBAPlayerAward.find({ season: "2022-23" })
      .lean()
      .then(function (playerawards) {
        var personIds = playerawards.map(function (playeraward) {
          return playeraward["personId"];
        });

        NBAPlayer.find({ personId: { $in: personIds } }).then(function (players) {
          for (i = 0; i < playerawards.length; i++) {
            for (j = 0; j < players.length; j++) {
              if (playerawards[i].personId == players[j].personId) {
                playerawards[i].player = players[j];
              }
            }
          }

          res.json(playerawards);
        });
      });
  });

  app.get("/nba/playerawards", function (req, res) {
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
        },
      },
    };

    res.render("pages/playerawards", { page: page, teamsJSON: teamsJSON });
  });
};
