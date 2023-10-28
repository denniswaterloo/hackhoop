const axios = require("axios");

const gamedates = require("../../data/gamedates.json");

module.exports = function (app, db, schemas) {
  const NBAGame = db.model("NBAGames", schemas.NBA.GameSchema);

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
          let cardsArray = json.data.modules[0]?.cards;

          res.json(cardsArray);

          if (cardsArray != undefined && cardsArray.length > 0) {
            for (c = 0; c < 1; c++) {
              let gameId = cardsArray[c].cardData.gameId;

              // axios.all([axiosInstance.get(`https://stats.nba.com/stats/boxscoresummaryv2?GameID=` + gameId)]).then(
              //   axios.spread((page) => {
              //     let gameSummary = page.data.resultSets[0];
              //     let otherStats = page.data.resultSets[1];
              //     let officials = page.data.resultSets[2];

              //     res.json(page.data.resultSets);
              //   })
              // );

              //https://stats.nba.com/stats/boxscoresummaryv2?GameID=0021700807

              //   new NBAGameCard(cardsArray[c].cardData).save(function (err) {
              //     if (err) {
              //       console.log(err);
              //     }
              //   })
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
