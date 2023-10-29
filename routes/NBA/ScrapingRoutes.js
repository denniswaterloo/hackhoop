const axios = require("axios");

const gamedates = require("../../data/gamedates.json");

module.exports = function (app, db, schemas) {
  const NBAGame = db.model("NBAGames", schemas.NBA.GameSchema);

  const NBATeamStat = db.model("NBATeamStats", schemas.NBA.TeamStatSchema);

  const axiosInstance = axios.create({
    headers: {
      authority: "core-api.nba.com",
      accept: "application/json",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "ocp-apim-subscription-key": "747fa6900c6c4e89a58b81b72f36eb96",
      origin: "https://www.nba.com",
      pragma: "no-cache",
      referer: "https://www.nba.com/",
      "sec-ch-ua": 'Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "macOS",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    },
  });

  app.get("/scrape/nba/games/latest", function (req, res) {
    for (prop in gamedates["2023"]["oct"]) {
      //total += obj[prop];
      axios.all([axiosInstance.get(`https://core-api.nba.com/cp/api/v1.1/feeds/gamecardfeed?gamedate=` + prop)]).then(
        axios.spread((json) => {
          let cardsArrayUnprocessed = json.data.modules[0]?.cards;

          var cardsArray = cardsArrayUnprocessed.filter(function (roster) {
            if (roster.cardType == "game") {
              return true;
            } else {
              return false;
            }
          });

          if (cardsArray != undefined && cardsArray.length > 0) {
            for (c = 0; c < 1; c++) {
              let gameId = cardsArray[c].cardData.gameId;

              axios
                .all([
                  axiosInstance.get(`https://core-api.nba.com/cp/api/v1.1/feeds/gamecardfeed?gamedate=` + prop),
                  axiosInstance.get(`https://stats.nba.com/stats/boxscoresummaryv2?GameID=` + gameId),

                  axiosInstance.get(
                    `https://stats.nba.com/stats/boxscoretraditionalv3?EndPeriod=1&EndRange=0&RangeType=0&StartPeriod=1&StartRange=0&GameID=` + gameId
                  ),
                ])
                .then(
                  axios.spread((gamedate_cards, boxscore_summary, traditional) => {
                    let cardsUnprocessed = gamedate_cards.data.modules[0]?.cards;

                    var cards = cardsUnprocessed.filter(function (card) {
                      if (card.cardType == "game") {
                        return true;
                      } else {
                        return false;
                      }
                    });

                    for (c = 0; c < cards.length; c++) {}

                    res.json(cards);

                    let gameSummaryData = boxscore_summary.data.resultSets[0].rowSet[0];
                    let traditionalData = traditional.data;

                    console.log(c);

                    //gameDateStringEastern = gameCardData.gameTimeEastern.split("T")[0];

                    //let dateStamp = parseInt(gameDateStringEastern.replaceAll("-", ""));

                    //res.json(gameCardData);

                    //awayTeamTricode = gameCardData.awayTeam.teamTricode;
                    //homeTeamTricode = gameCardData.homeTeam.teamTricode;

                    //gameStamp = awayTeamTricode + "-" + homeTeamTricode + "~" + gameDateStringEastern;

                    let awayTeam = {
                      gameId: gameSummaryData[2],
                      //gameStamp: gameStamp,
                      //gameCode: gameSummaryData[5],
                    };

                    //res.json(awayTeam);

                    // new NBATeamStat({
                    // gameId: gameSummary[2],
                    // // gameStamp: ,
                    // gameCode: gameSummary[5],
                    // dateStamp: dateStamp,
                    // seasonType: "",
                    // period: games[i].period,
                    // gameTimeUTC: games[i].gameTimeUTC,
                    // gameEt: games[i].gameEt,
                    // teamId: games[i].homeTeamId,
                    // teamTricode: homeTeamTricode,
                    // teamName: games[i].awayTeam.teamName,
                    // teamCity: games[i].awayTeam.teamCity,
                    // teamWins: games[i].awayTeam.teamWins,
                    // teamLosses: games[i].awayTeam.teamLosses,
                    // teamScore: games[i].awayTeam.score,
                    // entireGame: games[i].entireGame,
                    // firstQuarter: games[i].firstQuarter,
                    // secondQuarter: games[i].secondQuarter,
                    // thirdQuarter: games[i].thirdQuarter,
                    // fourthQuarter: games[i].fourthQuarter,
                    // firstHalf: games[i].firstHalf,
                    // secondHalf: games[i].secondHalf,
                    // overTimeAll: games[i].overTimeAll,
                    // overTimeOne: games[i].overTimeOne,
                    // overTimeTwo: games[i].overTimeTwo,
                    // overTimeThree: games[i].overTimeThree,
                    // overTimeFour: games[i].overTimeFour,
                    // overTimeFive: games[i].overTimeFive,
                    // overTimeSix: games[i].overTimeSix,
                    // overTimeSeven: games[i].overTimeSeven,
                    // overTimeEight: games[i].overTimeEight,
                    // overTimeNine: games[i].overTimeNine,
                    // overTimeTen: games[i].overTimeTen,
                    // }).save(function (err) {
                    //   console.log(err);
                    // });
                    //res.json(traditional.data.boxScoreTraditional);

                    //res.json(page.data.resultSets);
                  })
                );
            }
          }
        })
      );
    }

    //res.redirect("/ scrape/NBAGameCards");

    // res.send("ok");
  });

  app.get("/nba/gamecards.json", function (req, res) {
    let query = {};

    console.log(req.query);

    NBAGameCard.find({
      seasonYear: "2022-23",
    })
      .lean()
      .sort({ dateStamp: -1 })
      .exec(function (err, gamestats) {
        if (!err) {
          res.json(gamestats);
        }
      });
  });
};
