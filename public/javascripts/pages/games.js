global = {};

global.backbone = {
  collections: {},
  models: {},
  views: {},
};

global.pages = {};

global.pages.NBAGames = page;

console.log(global);

global.backbone.models.NBAGame = Backbone.Model.extend({});

global.backbone.collections.NBAGames = Backbone.Collection.extend({
  model: global.backbone.models.NBAGame,
  url: "/nba/games.json",
});

global.backbone.views.NBAGameTableRowMinifiedView = Backbone.View.extend({
  tagName: "tr",
  className: "stat-table-tr",
  template: _.template($("#NBAGameTableRowMinifiedView").html()),
  initialize: function () {
    $(this.render().el).hide().fadeIn(2000);
  },
  render: function () {
    obj = {
      gameEt: this.model.get("gameTimeEastern"),
      awayTeamScore: this.model.get("awayTeam").score,
      homeTeamScore: this.model.get("homeTeam").score,
      awayTeamTricode: this.model.get("awayTeam").teamTricode,
      homeTeamTricode: this.model.get("homeTeam").teamTricode,

      awayTeamWins: this.model.get("awayTeam").wins,
      homeTeamWins: this.model.get("homeTeam").wins,

      awayTeamLosses: this.model.get("awayTeam").losses,
      homeTeamLosses: this.model.get("homeTeam").losses,
    };

    this.$el.html(this.template(obj));
    return this;
  },
  remove: function () {
    $(this.el).fadeOut(500);
  },
  events: {},
});

global.backbone.views.NBAGamesTableMinifiedView = Backbone.View.extend({
  tagName: "div",
  className: "nba-gamescores",
  template: _.template($("#NBAGamesTableMinifiedView").html()),
  initialize: function (data) {
    this.render(data);
  },
  addNew: function (nbagamescore) {
    var newNBA = new global.views.NBAGameTableRowMinifiedView({ model: nbagamescore });
    this.$el.prepend(newNBAGameScore.el);
  },
  empty: function () {
    this.$el.html("");
  },
  render: function (data) {
    metadata = {
      teams: {
        DET: {
          total_wins: 0,
          total_losses: 0,
          away_wins: 0,
          home_wins: 0,
        },
      },
    };

    for (i = 0; i < data.collection.models.length; i++) {
      if (data.collection.models[i].get("awayTeam")["teamTricode"] === "DET") {
        if (data.collection.models[i].get("winningTeamAcronym") === "DET") {
          metadata.teams.DET.total_wins += 1;
        } else {
          metadata.teams.DET.total_losses += 1;
        }
      }

      if (data.collection.models[i].get("homeTeam")["teamTricode"] === "DET") {
        if (data.collection.models[i].get("winningTeamAcronym") === "DET") {
          metadata.teams.DET.total_wins += 1;
        } else {
          metadata.teams.DET.total_losses += 1;
        }
      }
    }

    let obj = {
      block: global.pages.NBAGames.blocks.NBAGames,
      data: data,
      metadata: metadata,
    };

    this.$el.html(this.template(obj));

    $(this.el).find(".seasonType").select2({
      minimumResultsForSearch: -1,
    });

    var button = $(this.el).find("#dddd");

    button[0].addEventListener("click", function () {
      document.getElementById("overlay").style.display = "block";
    });

    data.collection.each(function (nbagame) {
      let NBAGame = new global.backbone.views.NBAGameTableRowMinifiedView({ model: nbagame });
      $(this.el).find(".stat-table").append(NBAGame.$el);
    }, this);
    //return this;
  },
});

jQuery(function () {
  global.pages.NBAGames.blocks.NBAGames.data = new global.backbone.collections.NBAGames();
  global.pages.NBAGames.blocks.NBAGames.data.fetch({ async: false, data: global.pages.NBAGames.blocks.NBAGames.query });

  global.nbagamesview = new global.backbone.views.NBAGamesTableMinifiedView({ collection: global.pages.NBAGames.blocks.NBAGames.data });

  $(".page-body").append(global.nbagamesview.$el);
});
