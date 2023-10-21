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
  url: "/nba/playoffseries.json",
});

global.backbone.views.NBAPlayoffSerieView = Backbone.View.extend({
  tagName: "div",
  className: "section",
  template: _.template($("#NBAPlayoffSerieView").html()),
  initialize: function () {
    $(this.render().el).hide().fadeIn(2000);
  },
  render: function () {
    console.log(this);

    obj = {
      seasonYear: this.model.get("seasonYear"),
      playoffseries: this.model.get("playoffseries"),
    };

    this.$el.html(this.template(obj));
    return this;
  },
  remove: function () {
    $(this.el).fadeOut(500);
  },
  events: {},
});

global.backbone.views.NBAPlayoffSeriesView = Backbone.View.extend({
  tagName: "div",
  className: "nba-franchises",
  template: _.template($("#NBAPlayoffSeriesView").html()),
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
      let NBAGame = new global.backbone.views.NBAPlayoffSerieView({ model: nbagame });
      $(this.el).find(".block").append(NBAGame.$el);
    }, this);
    //return this;
  },
});

jQuery(function () {
  global.pages.NBAGames.blocks.NBAGames.data = new global.backbone.collections.NBAGames();
  global.pages.NBAGames.blocks.NBAGames.data.fetch({ async: false, data: global.pages.NBAGames.blocks.NBAGames.query });

  global.nbagamesview = new global.backbone.views.NBAPlayoffSeriesView({ collection: global.pages.NBAGames.blocks.NBAGames.data });

  $(".page-body").append(global.nbagamesview.$el);
});
