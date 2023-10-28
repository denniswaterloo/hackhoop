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
  url: "/nba/playerawards.json",
});

global.backbone.views.NBAAwardSubCategoryView = Backbone.View.extend({
  tagName: "tr",
  className: "stat-tr",
  template: _.template($("#NBAPlayerAwardSubCategoryView").html()),
  initialize: function () {
    $(this.render().el).hide().fadeIn(2000);
  },
  render: function () {
    obj = {
      description: this.model.get("description"),
      personId: this.model.get("personId"),
      playerFirstName: this.model.get("firstName"),
      playerLastName: this.model.get("lastName"),
      teamAcronym: this.model.get("teamAcronym"),
    };

    this.$el.html(this.template(obj));
    return this;
  },
  remove: function () {
    $(this.el).fadeOut(500);
  },
  events: {},
});

global.backbone.views.NBAGameTableRowMinifiedView = Backbone.View.extend({
  tagName: "div",
  className: "section",
  template: _.template($("#NBAPlayerAwardView").html()),
  initialize: function () {
    $(this.render().el).hide().fadeIn(2000);
  },
  render: function () {
    obj = {
      description: this.model.get("description"),
      personId: this.model.get("personId"),
      playerFirstName: this.model.get("firstName"),
      playerLastName: this.model.get("lastName"),
      teamAcronym: this.model.get("teamAcronym"),
      player: this.model.get("player"),
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
  template: _.template($("#NBAPlayerAwardsView").html()),
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
      season: seasons["2022-23"],
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
      for (team in seasons["2022-23"]["teams"]) {
        if (seasons["2022-23"]["teams"][team].team_fullname == nbagame.get("teamFullName")) {
          nbagame.set("teamAcronym", team);
        }
      }

      for (award in seasons["2022-23"]["awards"]) {
        if (seasons["2022-23"]["awards"][award].description == nbagame.get("description")) {
          nbagame.set("awardAcronym", award);

          for (subcategory in seasons["2022-23"]["awards"][award].sub_categories) {
            if (subcategory == nbagame.get("allNBATeamNumber")) {
              nbagame.set("awardSubCategory", subcategory);
            }
          }
        }
      }

      if (nbagame.get("awardSubCategory")) {
        let NBAGame = new global.backbone.views.NBAAwardSubCategoryView({ model: nbagame });

        $(this.el)
          .find("." + nbagame.get("awardAcronym") + " ." + nbagame.get("allNBATeamNumber"))
          .append(NBAGame.$el);
      } else {
        let NBAGame = new global.backbone.views.NBAGameTableRowMinifiedView({ model: nbagame });
        $(this.el)
          .find("." + nbagame.get("awardAcronym") + " .section-body")
          .append(NBAGame.$el);
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
