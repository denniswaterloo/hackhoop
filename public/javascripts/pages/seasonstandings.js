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
  url: "/nba/standings.json",
});

global.backbone.views.NBAGameTableRowMinifiedView = Backbone.View.extend({
  tagName: "tr",
  className: "stat-table-tr",
  template: _.template($("#NBASeasonStandingView").html()),
  initialize: function () {
    $(this.render().el).hide().fadeIn(2000);
  },
  render: function () {
    obj = {
      team_fullname: this.model.get("team_fullname"),
      team_name: this.model.get("team_name"),
      short_name: this.model.get("short_name"),
      acronym: this.model.get("acronym"),
      division: this.model.get("division"),
      conference: this.model.get("conference"),
      wins: this.model.get("wins"),
      losses: this.model.get("losses"),
      games: this.model.get("games"),
      home_wins: this.model.get("home_wins"),
      home_losses: this.model.get("home_losses"),
      away_wins: this.model.get("away_wins"),
      away_losses: this.model.get("away_losses"),
      winning_pct: this.model.get("winning_pct"),
      games_behind: this.model.get("games_behind"),
      conference_rank: this.model.get("conference_rank"),
      division_rank: this.model.get("division_rank"),
      conference_games_behind: this.model.get("conference_games_behind"),
      division_games_behind: this.model.get("division_games_behind"),
      playoffs: this.model.get("playoffs"),
      seed: this.model.get("seed"),
      season: this.model.get("season"),
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
  template: _.template($("#NBASeasonStandingsView").html()),
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
    let seasonYear = global.pages.NBAGames.blocks.NBAGames.query.season;

    let obj = {
      block: global.pages.NBAGames.blocks.NBAGames,
      data: data,
      seasons: seasons[seasonYear],
    };

    this.$el.html(this.template(obj));

    this.$el.find(".showHideToggle").on("click", function (e) {
      e.stopPropagation();
      e.preventDefault();

      let isStateShow = $(e.target).hasClass("stateShow");

      if (!isStateShow) {
        $(e.target).text("-Hide");

        $(e.target).addClass("stateShow");
        $(e.target).removeClass("stateHide");

        $(e.target).parents(".section").find(".showHide").slideDown();
      } else {
        $(e.target).text("+Show");

        $(e.target).addClass("stateHide");
        $(e.target).removeClass("stateShow");

        $(e.target).parents(".section").find(".showHide").slideUp();
      }
    });

    data.collection.each(function (nbagame) {
      let NBAGame = new global.backbone.views.NBAGameTableRowMinifiedView({ model: nbagame });

      $(this.el)
        .find("." + nbagame.get("division") + "-division")
        .append(NBAGame.$el);
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
