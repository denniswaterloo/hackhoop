const express = require("express");
const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const Schemas = {
  NBA: {
    FranchiseSchema: require("./models/NBA/FranchiseSchema"),
    GameSchema: require("./models/NBA/GameSchema"),
    PlayerSchema: require("./models/NBA/PlayerSchema"),

    TeamRosterSchema: require("./models/NBA/TeamRosterSchema"),

    PlayerAwardSchema: require("./models/NBA/PlayerAwardSchema"),
    PlayoffSerieSchema: require("./models/NBA/PlayoffSerieSchema"),

    GameScheduleSchema: require("./models/NBA/GameScheduleSchema"),
  },
};

var app = express();

var mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost/hackhoop";
var HoopDB = mongoose.createConnection(mongoURI);

require("./routes/NBA/MainRoutes")(app, HoopDB, Schemas);

require("./routes/NBA/ScrapingRoutes")(app, HoopDB, Schemas);

require("./routes/NBA/GameRoutes")(app, HoopDB, Schemas);
require("./routes/NBA/PlayerRoutes")(app, HoopDB, Schemas);
require("./routes/NBA/PlayerAwardRoutes")(app, HoopDB, Schemas);

require("./routes/NBA/TeamRosterRoutes")(app, HoopDB, Schemas);

require("./routes/NBA/GameScheduleRoutes")(app, HoopDB, Schemas);
require("./routes/NBA/FranchiseRoutes")(app, HoopDB, Schemas);
require("./routes/NBA/PlayoffSerieRoutes")(app, HoopDB, Schemas);
require("./routes/NBA/SeasonStandingsRoutes")(app, HoopDB, Schemas);

app.set("port", process.env.PORT || 5747);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "pug");

app.listen(5000, function (err) {
  console.log("Express Server Listening on port 5000");
});
