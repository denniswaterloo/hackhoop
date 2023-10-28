const axios = require("axios");
const teamsJSON = require("../../data/teams.json");

module.exports = function (app, db, schemas) {
  const NBAGameSchedule = db.model("NBAGameSchedules", schemas.NBA.GameScheduleSchema);
  //   const NBAGameStat = db.model("NBAGameStats", schemas.NBAGameStatSchema);

  //   const NBAPlayerInfo = db.model("NBAPlayerInfos", schemas.NBAPlayerInfoSchema);

  app.get("/nba/gameschedules.json", function (req, res) {
    NBAGameSchedule.find({}).exec(function (err, nbaplays) {
      if (!err) {
        res.json(nbaplays);
      }
    });
  });

  app.get("/nba/gamereport/:gameId", function (req, res) {
    var obj = {
      gameschedule: null,
      games: [],
      awayteamlast5games: [],
      players: [],
      awayTeamPlayersObj: null,
      homeTeamPlayersObj: null,
    };

    NBAGameSchedule.findOne({ gameId: req.params.gameId })
      .exec()
      .then((gameschedule) => {
        obj.gameschedule = gameschedule;

        return NBAGameStat.find({
          $or: [{ awayTeamTricode: gameschedule.awayTeam.teamTricode }, { homeTeamTricode: gameschedule.awayTeam.teamTricode }],
          seasonType: "Regular Season",
        })
          .sort({ dateStamp: -1 })
          .limit(5);
      })

      .then((awayteamlast5games) => {
        obj.awayteamlast5games = awayteamlast5games;

        let personIdArray = [];

        for (i = 0; i < awayteamlast5games.length; i++) {
          let awayTeamPlayers = awayteamlast5games[i].entireGame.traditional.awayTeam.players;
          let homeTeamPlayers = awayteamlast5games[i].entireGame.traditional.homeTeam.players;

          if (awayteamlast5games[i].awayTeamTricode == obj.gameschedule.awayTeam.teamTricode) {
            console.log(1);

            for (j = 0; j < awayTeamPlayers.length; j++) {
              personIdArray.push(awayTeamPlayers[j].personId);
            }
          }

          if (awayteamlast5games[i].homeTeamTricode == obj.gameschedule.awayTeam.teamTricode) {
            console.log(2);
            for (j = 0; j < homeTeamPlayers.length; j++) {
              personIdArray.push(homeTeamPlayers[j].personId);
            }
          }
        }

        let uniquePersonIdArray = [...new Set(personIdArray)];

        // res.json(awayteamlast5games[0]);

        let playersObj = {};

        for (i = 0; i < uniquePersonIdArray.length; i++) {
          playersObj[uniquePersonIdArray[i]] = {
            totalPoints: 0,
            personId: undefined,
            firstName: undefined,
            familyName: undefined,
            nameI: undefined,
            playerSlug: undefined,
            games: [],
          };
        }

        for (i = 0; i < awayteamlast5games.length; i++) {
          let awayTeamPlayers = awayteamlast5games[i].entireGame.traditional.awayTeam.players;
          let homeTeamPlayers = awayteamlast5games[i].entireGame.traditional.homeTeam.players;

          if (awayteamlast5games[i].awayTeamTricode == obj.gameschedule.awayTeam.teamTricode) {
            for (j = 0; j < awayTeamPlayers.length; j++) {
              playersObj[awayTeamPlayers[j].personId].personId = awayTeamPlayers[j].personId;
              playersObj[awayTeamPlayers[j].personId].firstName = awayTeamPlayers[j].firstName;
              playersObj[awayTeamPlayers[j].personId].familyName = awayTeamPlayers[j].familyName;
              playersObj[awayTeamPlayers[j].personId].nameI = awayTeamPlayers[j].nameI;
              playersObj[awayTeamPlayers[j].personId].playerSlug = awayTeamPlayers[j].playerSlug;

              playersObj[awayTeamPlayers[j].personId].totalPoints += awayTeamPlayers[j].statistics.points;

              playersObj[awayTeamPlayers[j].personId].games.push(awayTeamPlayers[j]);
            }
          }

          if (awayteamlast5games[i].homeTeamTricode == obj.gameschedule.awayTeam.teamTricode) {
            for (j = 0; j < homeTeamPlayers.length; j++) {
              playersObj[homeTeamPlayers[j].personId].personId = homeTeamPlayers[j].personId;
              playersObj[homeTeamPlayers[j].personId].firstName = homeTeamPlayers[j].firstName;
              playersObj[homeTeamPlayers[j].personId].familyName = homeTeamPlayers[j].familyName;
              playersObj[homeTeamPlayers[j].personId].nameI = homeTeamPlayers[j].nameI;
              playersObj[homeTeamPlayers[j].personId].playerSlug = homeTeamPlayers[j].playerSlug;

              playersObj[homeTeamPlayers[j].personId].totalPoints += homeTeamPlayers[j].statistics.points;

              playersObj[homeTeamPlayers[j].personId].games.push(homeTeamPlayers[j]);
            }
          }
        }

        // res.json(playersObj);

        obj.playersObj = playersObj;

        return NBAGameStat.find({
          $or: [{ homeTeamTricode: obj.gameschedule.homeTeam.teamTricode }, { awayTeamTricode: obj.gameschedule.homeTeam.teamTricode }],
          seasonType: "Regular Season",
        })
          .sort({ dateStamp: -1 })
          .limit(5);
      })

      .then((last5games) => {
        res.render("statvibe/gamereport", {
          game: obj.gameschedule,
          teamsStatic: teamsJSON,
          last5games: obj.awayteamlast5games,
          hometeamlast5games: last5games,
          playersObj: obj.playersObj,
        });
      });
  });

  app.get("/nba/gameschedules", function (req, res) {
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

    res.render("pages/gameschedules", { page: page });
  });

  // app.get("/nba/gamelinks/removeall", function (req, res) {
  //   NBAGameSchedule.deleteMany({}, function (error, playerlogs) {
  //     res.json(playerlogs);
  //   });
  // });

  const axiosInstance = axios.create({
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      Origin: "https://www.nba.com",
      Pragma: "no-cache",
      Referer: "https://www.nba.com/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      "sec-ch-ua": '"Not.A/Brand" v="8", "Chromium";v="114", "Google Chrome";v="114"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "macOS",
    },
  });

  app.get("/scrape/nba/gameschedules", function (req, res) {
    axios
      .all([axiosInstance.get("https://stats.nba.com/stats/scheduleleaguev2?Season=2023-24")])
      .then(
        axios.spread((schedules) => {
          let gameDates = schedules.data.leagueSchedule.gameDates;

          for (i = 0; i < gameDates.length; i++) {
            for (j = 0; j < gameDates[i].games.length; j++) {
              new NBAGameSchedule(gameDates[i].games[j]).save(function (err) {});
            }
          }

          res.json(schedules.data);
        })
      )
      .catch(function (err) {});
  });

  // app.get("/scrape/nba/playoffseries", function (req, res) {
  //   axios
  //     .all([axiosInstance.get("https://stats.nba.com/stats/commonplayoffseries?LeagueID=00&Season=2022-23")])
  //     .then(
  //       axios.spread((schedules) => {
  //         let gameDates = schedules.data.leagueSchedule.gameDates;

  //         for (i = 0; i < gameDates.length; i++) {
  //           for (j = 0; j < gameDates[i].games.length; j++) {
  //             new NBAGameSchedule(gameDates[i].games[j]).save(function (err) {});
  //           }
  //         }

  //         res.json(schedules.data);
  //       })
  //     )
  //     .catch(function (err) {});
  // });

  app.get("/playerprofiles/removeall", function (req, res) {
    PlayerProfile.deleteMany({}, function (error, playerlogs) {
      res.json(playerlogs);
    });
  });

  app.get("/scrape/nba/playerprofiles", function (req, res) {
    axios
      .all([axiosInstance.get("https://stats.nba.com/stats/playerindex?Active=1&LeagueID=00&season=2023-24")])
      .then(
        axios.spread((playerindex) => {
          let players = playerindex.data.resultSets[0].rowSet;

          for (i = 0; i < players.length; i++) {
            new NBAPlayerInfo({
              PERSON_ID: players[i][0],
              PLAYER_LAST_NAME: players[i][1],
              PLAYER_FIRST_NAME: players[i][2],
              PLAYER_SLUG: players[i][3],
              TEAM_ID: players[i][4],
              TEAM_SLUG: players[i][5],
              IS_DEFUNCT: players[i][6],
              TEAM_CITY: players[i][7],
              TEAM_NAME: players[i][8],
              TEAM_ABBREVIATION: players[i][9],
              JERSEY_NUMBER: players[i][10],
              POSITION: players[i][11],
              HEIGHT: players[i][12],
              WEIGHT: players[i][13],
              COLLEGE: players[i][14],
              COUNTRY: players[i][15],
              DRAFT_YEAR: players[i][16],
              DRAFT_ROUND: players[i][17],
              DRAFT_NUMBER: players[i][18],
              ROSTER_STATUS: players[i][19],
              FROM_YEAR: players[i][20],
              TO_YEAR: players[i][21],
            }).save(function (err) {});

            // for (j = 0; j < players[i].length; j++) {
            //   new NBAGameSchedule(gameDates[i].games[j]).save(function (err) {});
            // }
          }

          res.json(playerindex.data);
        })
      )
      .catch(function (err) {});
  });
};
