module.exports = function (app, db, schemas) {
  const NBAFranchise = db.model("NBAFranchises", schemas.NBA.FranchiseSchema);
  const NBAGame = db.model("NBAGames", schemas.NBA.GameSchema);

  const teamsJSON = require("../../data/teams.json");

  app.get("/patch/nba/franchises", function (req, res) {
    NBAFranchise.find({})
      .lean()
      .then(function (nbafranchises) {
        for (i = 0; i < nbafranchises.length; i++) {
          let seasons = {};

          for (k = nbafranchises[i].seasonFromYearBegin; k < nbafranchises[i].seasonToYearEnd; k++) {
            for (q = 0; q < nbafranchises[i].historicalTeamNames.length; q++) {
              if (nbafranchises[i].historicalTeamNames[q].seasonFromYearBegin <= k && nbafranchises[i].historicalTeamNames[q].seasonToYearEnd > k) {
                seasons[k + "-" + (k + 1 + "").slice(-2)] = {
                  teamName: nbafranchises[i].historicalTeamNames[q].teamName,
                  teamAcronym: nbafranchises[i].historicalTeamNames[q].teamAcronym,
                  league: nbafranchises[i].historicalTeamNames[q].leagues[0],
                };
              }
            }
          }

          NBAFranchise.updateOne(
            { _id: nbafranchises[i]._id },
            {
              $set: {
                seasons: seasons,
              },
            }
          ).then(function (user) {
            //console.log(user);
            // console.log("update user complete");
          });

          nbafranchises[i].seasons = seasons;
        }

        res.json(nbafranchises);
      });
  });

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
            for (season in nbafranchises[i].seasons) {
              nbafranchises[i].seasons[season].games_total = 0;
              nbafranchises[i].seasons[season].games_won = 0;
              nbafranchises[i].seasons[season].games_lost = 0;

              for (j = 0; j < nbagames.length; j++) {
                if (nbagames[j].seasonYear == season) {
                  //console.log(nbafranchises[i].historicalTeamAcronyms);

                  if (
                    nbafranchises[i].seasons[season].teamAcronym === nbagames[j].awayTeam.teamTricode ||
                    nbafranchises[i].seasons[season].teamAcronym === nbagames[j].homeTeam.teamTricode
                  ) {
                    console.log("YES");
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
