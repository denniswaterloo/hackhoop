module.exports = function (app, db, schemas) {
  const NBAPlayoffSerie = db.model("NBAPlayoffSeries", schemas.NBA.PlayoffSerieSchema);
  const NBAGame = db.model("NBAGames", schemas.NBA.GameSchema);

  const teamsJSON = require("../../data/teams.json");

  let seasons = [
    // "2022-23",
    // "2021-22",
    // "2020-21",
    // "2019-20",
    // "2018-19",
    // "2017-18",
    // "2016-17",
    // "2015-16",
    // "2014-15",
    // "2013-14",
    // "2012-13",
    // "2011-12",
    // "2010-11",
    // "2009-10",
    // "2008-09",
    // "2007-08",
    // "2006-07",
    // "2005-06",
    // "2004-05",
    // "2003-04",
    // "2002-03",
    // "2001-02",
    // "2000-01",
    // "1999-00",
    // "1998-99",
    // "1997-98",
    // "1996-97",
    // "1995-96",
    // "1994-95",
    // "1993-94",
    // "1992-93",
    // "1991-92",
    // "1990-91",
    // "1989-90",
    // "1988-89",
    // "1987-88",
    // "1986-87",

    "1946-47",
  ];

  app.get("/nba/playoffseries.json", function (req, res) {
    NBAPlayoffSerie.find({})
      .lean()
      .sort({ playoffRound: -1 })
      .then(function (playoffseries) {
        let seasons_objects = [];

        for (i = 0; i < seasons.length; i++) {
          let season_object = {
            playoffseries: [],
          };

          season_object.seasonYear = seasons[i];

          for (j = 0; j < playoffseries.length; j++) {
            if (playoffseries[j].seasonYear === season_object.seasonYear) {
              season_object.playoffseries.push(playoffseries[j]);
            }
          }

          seasons_objects.push(season_object);
        }

        res.json(seasons_objects);
      });
  });

  app.get("/nba/playoffseries", function (req, res) {
    NBAPlayoffSerie.find({}).then(function (nbafranchises) {
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

      res.render("pages/playoffseries", { page: page, teamsJSON: teamsJSON });
    });
  });
};
