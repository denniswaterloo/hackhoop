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
  url: "/nba/players.json",
});

global.backbone.views.NBAGameTableRowMinifiedView = Backbone.View.extend({
  tagName: "tr",
  className: "stat-table-tr",
  template: _.template($("#NBAPlayerView").html()),
  initialize: function () {
    $(this.render().el).hide().fadeIn(2000);
  },
  render: function () {
    obj = {
      personId: this.model.get("personId"),
      playerFirstName: this.model.get("playerFirstName"),
      playerLastName: this.model.get("playerLastName"),
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
  template: _.template($("#NBAPlayersView").html()),
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
      teams: {},
    };

    let obj = {
      block: global.pages.NBAGames.blocks.NBAGames,
      data: data,
      metadata: metadata,
    };

    console.log(obj);

    this.$el.html(this.template(obj));

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
