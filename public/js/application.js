$(document).ready(function() {

  var game = {}

  var WINNING_POSITION = 25;

  var current_url = window.location.pathname;

  var get_player_names = $.ajax({
    url: current_url + '/player_names',
    method: 'GET'
  });

  function Player(id, name, letter) {
    this.id = id;
    this.name = name;
    this.letter = letter.charCodeAt();
    this.position = 1;
    this.is_winner = function() {
      if (this.position == WINNING_POSITION) {
        return true;
      } else {
        return false;
      }
    };
    this.reset = function() {
      this.position = 0;
    };
  }

  Player.prototype.display = function() {
    return this.name + ": " + this.position.toString();
  };

  function setPlayers() {
    get_player_names.done(function(response) {
      var player1 = new Player('1', response[0], 'D');
      var player2 = new Player('2', response[1], 'J');
      return [player1, player2];
    });
  }


  function Game() {
    this.run = function() {
      render_player_names_DOM();
      move_player_DOM(move_listener());
      if (win_listener()) {
        `
        var winner = win_listener();
        update_database_and_redirect(winner);
      }
    };

    Game.prototype = function() {
      this.players = setPlayers();
      this.clear_table = clear_table();
    };

    function move_player_DOM(player) {
      if (player) {
        player.position++;
        update_player_position_DOM(player);
      }
    }

    function render_player_names_DOM() {
      $('#player1_name').html(player1.name);
      $('#player2_name').html(player2.name);
    }


    function move_listener() {
      Game.move_listener()
      $(document).on('keyup', function(event) {
        if (event.which == player1.letter) {
          return player1;
        } else if (event.which == player2.letter) {
          return player2;
        }
      });
    }

    function update_player_position_DOM(player) {
      player_strip = '#player' + player.id + '_strip';
      $(player_strip).children('td').removeClass('active');
      $(player_strip).append('<td class="active"> </td>');
    }

    var win_listener = function() {
      $(document).on('keyup', function(event) {
        if (player1.is_winner()) {
          return player1;
        } else if (player2.is_winner()) {
          return player2;
        }
      });
    };

    var update_database_and_redirect = function(winner) {
      $.ajax({
        url: current_url + '/' + winner.name,
        method: 'POST'
      }).done(function(response) {
        result = current_url.replace(/play/g, 'game');
        window.location.href = result;
      });
    };

    // function render_winner_DOM(player1, player2) {
    //   if (player1.is_winner()) {
    //     $('#winner').text(player1.display() + " " + player2.display());
    //     return player1;
    //   } else if (player2.is_winner()) {
    //     $('#winner').text(player2.display() + " " + player1.display());
    //     return player2;
    //   }
    // }


    // function clear_table_DOM() {
    //   $('.racer_table tr').empty().append('<td class="active"> </td>');
    //   $('#winner').text("");
    // }


    // $('#restart').on('click', function () {
    //   player1.reset();
    //   player2.reset();
    //   clear_table();
    //   move_listener();
    //   win_listener();
    // $(this).hide();
    // });

    DOMgame = new Game();
    DOMgame.run();

  });
