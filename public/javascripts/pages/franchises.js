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
});

global.backbone.views.NBAFranchiseView = Backbone.View.extend({
  tagName: "tr",
  className: "stat-table-tr",
  template: _.template($("#NBAFranchiseView").html()),
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
    data.collection.each(function (nbagame) {
      let NBAGame = new global.backbone.views.NBAFranchiseView({ model: nbagame });
      $(this.el).find(".stat-table").append(NBAGame.$el);
    }, this);
    //return this;
  },
});

jQuery(function () {
  global.pages.NBAGames.blocks.NBAGames.data = new global.backbone.collections.NBAGames();
  global.pages.NBAGames.blocks.NBAGames.data.fetch({ async: false, data: global.pages.NBAGames.blocks.NBAGames.query });

  global.nbagamesview = new global.backbone.views.NBAFranchisesView({ collection: global.pages.NBAGames.blocks.NBAGames.data });

  $(".page-body").append(global.nbagamesview.$el);
});
