module.exports = function (app, db, schemas) {
  const NBAFranchise = db.model("NBAFranchises", schemas.NBA.FranchiseSchema);
  const NBAGame = db.model("NBAGames", schemas.NBA.GameSchema);

  const teamsJSON = require("../../data/teams.json");

  app.get("/nba/franchises.json", function (req, res) {
    NBAFranchise.find({})
      .collation({ locale: "en", strength: 2 })
      .sort({ currentTeamFullName: 1 })
      .lean()
      .then(function (nbafranchises) {
        NBAGame.find({
          seasonType: "Regular Season",
        }).then(function (nbagames) {
          for (i = 0; i < nbafranchises.length; i++) {
            nbafranchises[i].seasons = {
              // "2022-23": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2021-22": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2020-21": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },

              // "2019-20": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },

              // "2018-19": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },

              // "2017-18": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2016-17": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2015-16": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2014-15": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2013-14": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2012-13": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2011-12": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2010-11": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2009-10": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2008-09": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2007-08": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2006-07": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2005-06": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2004-05": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2003-04": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2002-03": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              // "2001-02": {
              //   games_total: 0,
              //   games_won: 0,
              //   games_lost: 0,
              // },
              "1946-47": {
                games_total: 0,
                games_won: 0,
                games_lost: 0,
              },
            };

            for (j = 0; j < nbagames.length; j++) {
              for (season in nbafranchises[i].seasons) {
                if (nbagames[j].seasonYear == season) {
                  if (
                    nbafranchises[i].historicalTeamAcronyms.includes(nbagames[j].awayTeam.teamTricode) ||
                    nbafranchises[i].historicalTeamAcronyms.includes(nbagames[j].homeTeam.teamTricode)
                  ) {
                    nbafranchises[i].seasons[season].games_total += 1;

                    if (nbafranchises[i].historicalTeamAcronyms.includes(nbagames[j].winningTeamAcronym)) {
                      nbafranchises[i].seasons[season].games_won += 1;
                    }

                    if (nbafranchises[i].historicalTeamAcronyms.includes(nbagames[j].losingTeamAcronym)) {
                      nbafranchises[i].seasons[season].games_lost += 1;
                    }
                  }
                }
              }
            }
          }

          res.json(nbafranchises);
        });
      });
  });

  app.get("/nba/franchises", function (req, res) {
    NBAFranchise.find({}).then(function (nbafranchises) {
      query = {};
      filter = {};

      let page = {
        blocks: {
          NBAFranchises: {
            query: query,
            filter: filter,
            data: {
              static: {},
            },
            default_view: "NBAFranchisesView",
          },
        },
      };

      res.render("pages/franchises", { page: page, teamsJSON: teamsJSON });
    });
  });

  app.get("/nba/franchises/namechanges", function (req, res) {
    query = {};
    filter = {};

    let page = {
      blocks: {
        NBAFranchises: {
          query: query,
          filter: filter,
          data: {
            static: {},
          },
          default_view: "NBAFranchisesNameChangesView",
        },
      },
    };

    res.render("pages/franchises", { page: page, teamsJSON: teamsJSON });
  });
};
