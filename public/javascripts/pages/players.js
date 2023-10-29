global = {};

global.backbone = {
  collections: {},
  models: {},
  views: {},
};

global.pages = {};

global.pages.NBAPlayers = page;

console.log(global);

global.backbone.models.NBAPlayer = Backbone.Model.extend({});

global.backbone.collections.NBAPlayers = Backbone.Collection.extend({
  model: global.backbone.models.NBAPlayer,
  url: "/nba/players.json",
});

global.backbone.views.NBAPlayerView = Backbone.View.extend({
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
      position: this.model.get("position"),

      height: this.model.get("heightFt"),

      draftYear: this.model.get("draftYear"),
      draftRound: this.model.get("draftRound"),
      draftNumber: this.model.get("draftNumber"),
    };

    this.$el.html(this.template(obj));
    return this;
  },
  remove: function () {
    $(this.el).fadeOut(500);
  },
  events: {},
});

global.backbone.views.NBAPlayersView = Backbone.View.extend({
  tagName: "div",
  className: "nba-players",
  template: _.template($("#NBAPlayersView").html()),
  initialize: function (data) {
    this.render(data);
  },
  addNew: function (nbagamescore) {
    var newNBA = new global.views.NBAGamePlayerView({ model: nbagamescore });
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
      block: global.pages.NBAPlayers.blocks.NBAGames,
      data: data,
      metadata: metadata,
    };

    console.log(obj);

    this.$el.html(this.template(obj));

    data.collection.each(function (nbaplayer) {
      let NBAPlayer = new global.backbone.views.NBAPlayerView({ model: nbaplayer });
      $(this.el).find(".stat-table").append(NBAPlayer.$el);
    }, this);
    //return this;
  },
});

jQuery(function () {
  global.pages.NBAPlayers.blocks.NBAGames.data = new global.backbone.collections.NBAPlayers();
  global.pages.NBAPlayers.blocks.NBAGames.data.fetch({ async: false, data: global.pages.NBAPlayers.blocks.NBAGames.query });

  global.NBAPlayersView = new global.backbone.views.NBAPlayersView({ collection: global.pages.NBAPlayers.blocks.NBAGames.data });

  $(".page-body").append(global.NBAPlayersView.$el);
});
