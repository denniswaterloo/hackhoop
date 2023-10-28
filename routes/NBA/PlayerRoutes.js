module.exports = function (app, db, schemas) {
  const NBAPlayer = db.model("NBAPlayers", schemas.NBA.PlayerSchema);

  app.get("/nba/players.json", function (req, res) {
    NBAPlayer.find({}).then(function (players) {
      res.json(players);
    });
  });

  app.get("/nba/players", function (req, res) {
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

    res.render("pages/players", { page: page });
  });
};
