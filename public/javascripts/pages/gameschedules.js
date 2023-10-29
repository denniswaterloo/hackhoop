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
  url: "/nba/gameschedules.json",
});

global.backbone.views.NBAGameTableRowMinifiedView = Backbone.View.extend({
  tagName: "tr",
  className: "section",
  template: _.template($("#NBAGameScheduleView").html()),
  initialize: function () {
    $(this.render().el).hide().fadeIn(2000);
  },
  render: function () {
    obj = {
      gameDateEst: this.model.get("gameDatEst"),
      awayTeam: this.model.get("awayTeam"),
      homeTeam: this.model.get("homeTeam"),
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
  template: _.template($("#NBAGameSchedulesView").html()),
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

    data.collection.each(function (gameschedule) {
      let NBAGameSchedule = new global.backbone.views.NBAGameTableRowMinifiedView({ model: gameschedule });

      for (date in seasons["2023-24"]["gamedates"]) {
        if (date == gameschedule.get("gameDateEst").split("T")[0]) {
          gameschedule.set("dateString", date);

          $(this.el)
            .find("." + date + " tbody")
            .append(NBAGameSchedule.$el);
        }
      }
    }, this);
    //return this;
  },
});

jQuery(function () {
  global.pages.NBAGames.blocks.NBAGames.data = new global.backbone.collections.NBAGames();
  global.pages.NBAGames.blocks.NBAGames.data.fetch({ async: false, data: global.pages.NBAGames.blocks.NBAGames.query });

  console.log(global.pages.NBAGames.blocks.NBAGames.data);

  global.nbagamesview = new global.backbone.views.NBAGamesTableMinifiedView({ collection: global.pages.NBAGames.blocks.NBAGames.data });

  $(".page-body").append(global.nbagamesview.$el);
});
