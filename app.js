const express = require("express");
const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const Schemas = {
  NBA: {
    FranchiseSchema: require("./models/NBA/FranchiseSchema"),
    GameSchema: require("./models/NBA/GameSchema"),
    PlayoffSerieSchema: require("./models/NBA/PlayoffSerieSchema"),

    GameScheduleSchema: require("./models/NBA/GameScheduleSchema"),
  },
};

var app = express();

var mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost/hackhoop";
var HoopDB = mongoose.createConnection(mongoURI);

require("./routes/NBA/GameRoutes")(app, HoopDB, Schemas);
require("./routes/NBA/GameScheduleRoutes")(app, HoopDB, Schemas);
require("./routes/NBA/FranchiseRoutes")(app, HoopDB, Schemas);
require("./routes/NBA/PlayoffSerieRoutes")(app, HoopDB, Schemas);

app.set("port", process.env.PORT || 5747);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "pug");

app.listen(5000, function (err) {
  console.log("Express Server Listening on port 5000");
});
