const seasons = require("../../data/seasons.json");

module.exports = function (app, db, schemas) {
  //const NBAPlayer = db.model("NBAPlayers", schemas.NBA.PlayerSchema);

  // app.get("/nba/players.json", function (req, res) {
  //   NBAPlayer.find({}).then(function (players) {
  //     res.json(players);
  //   });
  // });

  app.get("/nba/season/:season", function (req, res) {
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

    res.render("pages/season", { page: page, seasons: seasons });
  });
};
