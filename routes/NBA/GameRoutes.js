module.exports = function (app, db, schemas) {
  const NBAGame = db.model("NBAGames", schemas.NBA.GameSchema);
  const teamsJSON = require("../../data/teams.json");

  app.get("/nba/games", function (req, res) {
    let query = req.query;
    let filter = {
      teams: null,
    };

    if (!query.season) {
      filter.isCurrentSeason = true;

      query.season = "2022-23";
    } else {
      filter.season = query.season;
    }

    if (!query.type) {
      filter.isAllGames = true;
    } else if (query.type == "playoffs") {
      filter.isAllGames = false;

      filter.seasonType = "Playoffs";
    } else if (query.type == "regularseason") {
      filter.isAllGames = false;

      filter.seasonType = "Regular Season";
    } else {
      filter.isAllGames = true;
    }

    if (!query.teams) {
      filter.isAllTeams = true;
    } else {
      filter.teams = query.teams.split("~");
    }

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

    res.render("pages/games", { page: page, teamsJSON: teamsJSON });
  });

  app.get("/nba/games.json", function (req, res) {
    let query = {};

    if (req.query.season) {
      if (!query.$and) {
        query.$and = [];
      }

      query.$and.push({ seasonYear: req.query.season });
    }

    if (req.query.type) {
      if (!query.$and) {
        query.$and = [];
      }

      if (req.query.type == "playoffs") {
        query.$and.push({ seasonType: "Playoffs" });
      } else if (req.query.type == "regularseason") {
        query.$and.push({ seasonType: "Regular Season" });
      }
    }

    if (req.query.months) {
      months = req.query.months.split("~");
      query.$or = [];
      for (i = 0; i < months.length; i++) {
        query.$or.push({ monthStringShort: months[i] });
      }
    }

    if (req.query.teams) {
      if (!query.$and) {
        query.$and = [];
      }

      query.$and.push({ $or: [] });

      teams = req.query.teams.split("~");

      for (i = 0; i < teams.length; i++) {
        query.$and[query.$and.length - 1].$or.push({ "awayTeam.teamTricode": teams[i] });
        query.$and[query.$and.length - 1].$or.push({ "homeTeam.teamTricode": teams[i] });
      }
    }

    if (req.query.total_points) {
      if (!query.$and) {
        query.$and = [];
      }

      query.$and.push({ $expr: { $gt: [{ $add: ["$homeTeamScore", "$awayTeamScore"] }, 230] } });
    }

    NBAGame.find(query)
      .sort({ dateStamp: -1 })
      .then(function (nbagames) {
        res.json(nbagames);
      });
  });
};
