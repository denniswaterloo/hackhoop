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
  url: "/nba/franchises.json",
  filterByHasGames: function () {
    filtered = this.filter(function (franchise) {
      games_total = 0;

      for (season in franchise.get("seasons")) {
        games_total += franchise.get("seasons")[season].games_total;
      }

      return games_total > 0;
    });
    return new global.backbone.collections.NBAGames(filtered);
  },
});

global.backbone.views.NBAFranchiseView = Backbone.View.extend({
  tagName: "div",
  className: "nba-franchise",
  template: _.template($("#NBAFranchiseView").html()),
  initialize: function () {
    $(this.render().el).hide().fadeIn(2000);
  },
  render: function () {
    obj = {
      seasons: this.model.get("seasons"),
      currentTeamAcronym: this.model.get("currentTeamAcronym"),
      currentTeamFullName: this.model.get("currentTeamFullName"),
    };

    this.$el.html(this.template(obj));
    return this;
  },
  remove: function () {
    $(this.el).fadeOut(500);
  },
  events: {},
});

global.backbone.views.NBAFranchiseNameChangesView = Backbone.View.extend({
  tagName: "div",
  className: "nba-franchise",
  template: _.template($("#NBAFranchiseNameChangesView").html()),
  initialize: function () {
    $(this.render().el).hide().fadeIn(2000);
  },
  render: function () {
    obj = {
      seasons: this.model.get("seasons"),
      historicalTeamNames: this.model.get("historicalTeamNames"),
      currentTeamAcronym: this.model.get("currentTeamAcronym"),
      currentTeamFullName: this.model.get("currentTeamFullName"),
    };

    this.$el.html(this.template(obj));
    return this;
  },
  remove: function () {
    $(this.el).fadeOut(500);
  },
  events: {},
});

global.backbone.views.NBAFranchisesNameChangesView = Backbone.View.extend({
  tagName: "div",
  className: "nba-franchises",
  template: _.template($("#NBAFranchisesNameChangesView").html()),
  initialize: function (data) {
    this.render(data);
  },
  empty: function () {
    this.$el.html("");
  },
  render: function (data) {
    let obj = {};

    this.$el.html(this.template(obj));

    data.collection.each(function (nbagame) {
      let NBAGame = new global.backbone.views.NBAFranchiseNameChangesView({ model: nbagame });
      $(this.el).find(".block-body").append(NBAGame.$el);
    }, this);
    //return this;
  },
});

global.backbone.views.NBAFranchisesView = Backbone.View.extend({
  tagName: "div",
  className: "nba-franchises",
  template: _.template($("#NBAFranchisesView").html()),
  initialize: function (data) {
    this.render(data);
  },
  empty: function () {
    this.$el.html("");
  },
  render: function (data) {
    let obj = {};

    this.$el.html(this.template(obj));

    data.collection.each(function (nbagame) {
      let NBAGame = new global.backbone.views.NBAFranchiseView({ model: nbagame });
      $(this.el).find(".block-body").append(NBAGame.$el);
    }, this);
    //return this;
  },
});

jQuery(function () {
  global.pages.NBAGames.blocks.NBAFranchises.data = new global.backbone.collections.NBAGames();
  global.pages.NBAGames.blocks.NBAFranchises.data.fetch({ async: false, data: global.pages.NBAGames.blocks.NBAFranchises.query });

  global.pages.NBAGames.blocks.NBAFranchises.data = global.pages.NBAGames.blocks.NBAFranchises.data.filterByHasGames();

  global.nbagamesview = new global.backbone.views[page.blocks.NBAFranchises.default_view]({ collection: global.pages.NBAGames.blocks.NBAFranchises.data });

  $(".page-body").append(global.nbagamesview.$el);
});
