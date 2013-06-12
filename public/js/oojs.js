$(document).ready(function() {

  var current_url = window.location.pathname;

  function Player(name, key, id) {
    this.id = id;
    this.name = name;
    this.key = key.charCodeAt();
    this.position = 0;
  }

  Player.prototype = {
    advance: function() {
      this.position++;
    },
    checkWon: function() {
      if (this.position === game.length) {
        return true;
      } else {
        return false;
      }
    }
  };

  function ConsoleBoard() {}

  ConsoleBoard.prototype = {
    render: function(player) {
      console.log(player);
      console.log(player.name + " : " + player.position);
    },
    renderWinner: function(winner) {
      console.log(winner.name + " won the game!");
    }
  };

  function DOMBoard() {}

  DOMBoard.prototype = {
    render: function(player) {
      //update the DOM
      console.log(player);
      player_strip = '#player' + player.id + '_strip';
      $(player_strip).children('td').removeClass('active');
      $(player_strip).append('<td class="active"> </td>');
    },
    renderWinner: function(winner) {
      $.ajax({
        url: current_url + '/' + winner.name,
        method: 'POST'
      }).done(function(response) {
        window.location.href = current_url.replace(/play/g, 'game');
      });
    }
  };


  function Game(length, names) {
    this.keys = ["A", "F", "H", "L"];
    this.still_playing = true;
    this.length = length;
    this.players = [];
    for (var i in names) {
      this.players.push(new Player(names[i], this.keys[i], parseInt(i, 10)+1));
    }
    // this.players.push(new Player("Matt", "K"));
    // this.players.push(new Player("Josh", "S"));
    this.gameboard = new ConsoleBoard();
    this.keyUp = function(keyNum) {
      for (var i in this.players) {
        if (this.players[i].key === keyNum) {
          this.players[i].advance();
          this.render(this.players[i]);
        }
      }

      for (var j in this.players) {
        if (this.players[j].checkWon()) {
          this.renderWinner(this.players[j]);
          this.still_playing = false;
        }
      }
      return null;
    };
    this.render = function(player) {
      this.gameboard.render(player);
    };

    this.renderWinner = function(winner) {
      this.gameboard.renderWinner(winner);
    };
  }

  console.log(current_url);

  $.ajax({
    url: current_url + '/player_names',
    method: 'GET'
  }).done(function(player_names) {
    game = new Game(10, player_names);
    console.log(game);
  });

  $(document).on('keyup', function(e) {
    if (game.still_playing) {
      game.keyUp(e.keyCode);
    }
  });

});
