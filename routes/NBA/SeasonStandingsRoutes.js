const seasons = require("../../data/seasons.json");

module.exports = function (app, db, schemas) {
  const NBAGame = db.model("NBAGames", schemas.NBA.GameSchema);

  const teamsJSON = require("../../data/teams.json");

  app.get("/nba/standings.json", function (req, res) {
    NBAGame.find({
      seasonYear: req.query.season,
      seasonType: "Regular Season",
    })
      .lean()
      .sort({ dateStamp: -1 })
      .then(function (games) {
        let teams = seasons[req.query.season].teams;

        for (team in teams) {
          teams[team].season = req.query.season;
          teams[team].wins = 0;
          teams[team].losses = 0;
          teams[team].games = 0;
          teams[team].home_wins = 0;
          teams[team].home_losses = 0;
          teams[team].away_wins = 0;
          teams[team].away_losses = 0;
        }

        for (i = 0; i < games.length; i++) {
          for (team in teams) {
            if (games[i].awayTeam.teamTricode == team) {
              teams[team].games += 1;

              if (games[i].awayTeam.score > games[i].homeTeam.score) {
                teams[team].wins += 1;
                teams[team].away_wins += 1;
              } else {
                teams[team].losses += 1;
                teams[team].away_losses += 1;
              }
            } else if (games[i].homeTeam.teamTricode == team) {
              teams[team].games += 1;

              if (games[i].homeTeam.score > games[i].awayTeam.score) {
                teams[team].wins += 1;
                teams[team].home_wins += 1;
              } else {
                teams[team].losses += 1;
                teams[team].home_losses += 1;
              }
            }
          }
        }

        let newteams = {};

        for (team in teams) {
          teams[team].winning_pct = teams[team].wins / teams[team].games;
        }

        Object.keys(teams)
          .sort(function (a, b) {
            return teams[b].winning_pct - teams[a].winning_pct;
          })
          .forEach(function (key) {
            newteams[key] = teams[key];
          });

        let array = [];
        for (team in newteams) {
          array.push(newteams[team]);
        }

        // array[0].games_behind = 0;

        // for (i = 1; i < array.length; i++) {
        //   array[i].games_behind = (array[0].wins - array[i].wins + (array[i].losses - array[0].losses)) / 2;
        // }

        let teams_final = [];

        if (seasons[req.query.season]["conferences"]) {
          let conferencesNames = seasons[req.query.season]["conferences"];

          let conferences = {};

          for (conf in conferencesNames) {
            // console.log(seasons[req.query.season]["conferences"]);

            let divisionsNames = seasons[req.query.season]["conferences"][conf];

            // console.log(divisionsNames);

            conferences[conf] = [];

            for (div in divisionsNames) {
              for (j = 0; j < array.length; j++) {
                if (array[j].division == div) {
                  conferences[conf].push(array[j]);
                }
              }
            }

            conferences[conf] = conferences[conf].sort(({ winning_pct: a }, { winning_pct: b }) => b - a);
          }

          for (conf in conferences) {
            conferences[conf][0].conference_games_behind = 0;
            conferences[conf][0].conference_rank = 1;

            for (i = 1; i < conferences[conf].length; i++) {
              conferences[conf][i].conference_games_behind =
                (conferences[conf][0].wins - conferences[conf][i].wins + (conferences[conf][i].losses - conferences[conf][0].losses)) / 2;
              conferences[conf][i].conference_rank = i + 1;
            }
          }

          let conferences_with_divisions = {};

          for (conf in conferencesNames) {
            conferences_with_divisions[conf] = {};

            for (div in conferencesNames[conf]) {
              conferences_with_divisions[conf][div] = [];

              for (j = 0; j < array.length; j++) {
                if (array[j].division == div) {
                  conferences_with_divisions[conf][div].push(array[j]);
                }
              }
            }
          }

          for (conf in conferences_with_divisions) {
            for (div in conferences_with_divisions[conf]) {
              conferences_with_divisions[conf][div][0].division_games_behind = 0;
              conferences_with_divisions[conf][div][0].division_rank = 1;

              for (i = 1; i < conferences_with_divisions[conf][div].length; i++) {
                conferences_with_divisions[conf][div][i].division_games_behind =
                  (conferences_with_divisions[conf][div][0].wins -
                    conferences_with_divisions[conf][div][i].wins +
                    (conferences_with_divisions[conf][div][i].losses - conferences_with_divisions[conf][div][0].losses)) /
                  2;
                conferences_with_divisions[conf][div][i].division_rank = i + 1;
              }
            }

            for (div in conferences_with_divisions[conf]) {
              for (i = 0; i < conferences_with_divisions[conf][div].length; i++) {
                teams_final.push(conferences_with_divisions[conf][div][i]);
              }
            }
          }

          // res.json(conferences_with_divisions);

          //---------division
        } else {
          console.log(3333);

          let divisionsNames = seasons[req.query.season]["divisions"];

          let divisions = {};

          for (div in divisionsNames) {
            divisions[div] = [];

            for (j = 0; j < array.length; j++) {
              if (array[j].division == div) {
                divisions[div].push(array[j]);
              }
            }
          }

          for (div in divisions) {
            divisions[div][0].division_games_behind = 0;
            divisions[div][0].division_rank = 1;

            for (i = 1; i < divisions[div].length; i++) {
              divisions[div][i].division_games_behind =
                (divisions[div][0].wins - divisions[div][i].wins + (divisions[div][i].losses - divisions[div][0].losses)) / 2;
              divisions[div][i].division_rank = i + 1;
            }
          }

          for (div in divisions) {
            for (i = 0; i < divisions[div].length; i++) {
              teams_final.push(divisions[div][i]);
            }
          }
        }

        // for (j = 0; j < array.length; j++) {
        //   for (i = 0; i < easternConf.length; i++) {
        //     if (easternConf[i] == array[j].acronym) {
        //       easternConf_teams.push(array[j]);
        //     }
        //   }
        // }

        // for (j = 0; j < array.length; j++) {
        //   for (i = 0; i < westernConf.length; i++) {
        //     if (westernConf[i] == array[j].acronym) {
        //       westernConf_teams.push(array[j]);
        //     }
        //   }
        // }

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

        res.json(teams_final);

        //res.render("statvibe/", { gamestats_previous: games, teams: array, easternConf_teams: easternConf_teams });
      });
  });

  app.get("/nba/standings/:season", function (req, res) {
    query = { season: req.params.season };
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

    res.render("pages/seasonstandings", { page: page, seasons: seasons, teamsJSON: teamsJSON });
  });
};
