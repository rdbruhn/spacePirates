var db = require('../db/db');

var Player = function (gameId, socketId, userId, username) {
  this.gameId = gameId;
  this.socketId = socketId;
  this.userId = userId;
  this.lastPlayed = {};
  this.playerId = '';
  this.username = username;
};

Player.prototype = {
  constructor: Player,

  discard: function (tileId) {
    var player = this;

    return db.Player.get(this.playerId)
    .run()
    .then(function (doc) {
      for (var i = 0; i < 3; i++) {
        if (tileId === doc.hand[i].tileId) {
          doc.hand.splice(i, 1);
          break;
        }
      }
      return doc.save()
      .then(function () {
        return db.Board.filter({gameId: player.gameId})
        .run()
        .then(function(data) {
          return data[0];
        })
        .catch(function(err) {
          console.error(err);
        });
      })
      .catch(function (err) {
        console.error(err);
      });
    })
    .catch(function (err) {
      console.error(err);
    });
  },

  getRole: function() {
    return db.Player.get(this.playerId)
    .then(function(doc) {
      return doc.role;
    })
    .catch(function(err) {
      console.error(err);
    });
  },

  isTurn: function() {
    return db.Player.get(this.playerId)
    .then(function(doc) {
      return doc.isTurn;
    })
    .catch(function(err) {
      console.error(err);
    });
  },

  changeTurn: function() {
    return db.Player.get(this.playerId)
    .then(function(doc) {
      doc.isTurn = !doc.isTurn;
      return doc.save()
      .then(function(player) {
        return player;
      })
      .catch(function(err) {
        console.error(err);
      });
    })
    .catch(function(err) {
      console.error(err);
    });
  },

  getHand: function() {
    return db.Player.get(this.playerId)
    .then(function(doc) {
      return doc.hand;
    })
    .catch(function(err) {
      console.error(err);
    });
  },

  updateInfo: function(hand, turn, role) {
    return db.Player.get(this.playerId)
    .update({
      hand: hand,
      role: role,
      isTurn: turn
    })
    .run()
    .catch(function(err) {
      console.error(err);
    });
  },

  initialize: function () {
    var player = this;

    return new db.Player({
      gameId: player.gameId,
      socketId: player.socketId,
      userId: player.userId,
      role: '',
      isTurn: false,
      hand: [],
      debuffs: [],
      username: player.username
    })
    .save()
    .then(function (data) {
      player.playerId = data.id;
    })
    .catch(function (err) {
      console.error(err);
    });
  }
};

module.exports = Player;
