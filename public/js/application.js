$(document).ready(function() {

  var MAX_POSITION = 30;

  var current_url = window.location.pathname;

  var players_names;

  $.ajax({
    url: current_url+'/player_names',
    method: 'GET'
  }).done(function(response){
    players_names = response;

    function update_player_position (player) {
      player.position++;
      player_strip = '#player' + player.id + '_strip';
      $(player_strip).children('td').removeClass('active');
      $(player_strip).append('<td class="active"> </td>');
    }

    function clear_table() {
      $('.racer_table tr' ).empty().append('<td class="active"> </td>');
      $('#winner').text("");
    }

    function Player (id, name, letter) {
      this.id = id;
      this.name = name;
      this.letter = letter.charCodeAt();
      this.position = 1;
      this.move = function () { update_player_position(this); };
      this.is_winner = function () {
        if (this.position == MAX_POSITION) {
          return true;
        }
        else {
          return false;
        }
      };
      this.reset = function () { this.position = 0; };
    }

    // Player.prototype = {
    //   display: function() {
    //     return this.name +": "+ this.position.toString();
    //   }
    // };

    Player.prototype.display = function () {
      return this.name +": "+ this.position.toString();
    };

    var player1 = new Player('1', players_names[0], 'J');
    var player2 = new Player('2', players_names[1], 'D');

    function display_winner(player1, player2) {
      if (player1.is_winner()) {
        $('#winner').text(player1.display() +" " + player2.display());
        return player1;
      } else if (player2.is_winner()) {
        $('#winner').text(player2.display() +" " + player1.display());
        return player2;
      }
    }

    var update_winner = function (winner) {
      console.log(current_url);
      console.log(winner.name);
      $.ajax({
        url: current_url + '/' + winner.name,
        method: 'POST'
      }).done(function (response) {
        result = current_url.replace(/play/g, 'game');
        window.location.href = result;
      });
    };

    var win_listener = function () {
      $(document).on('keyup', function(event){
        if (player1.is_winner() || player2.is_winner()) {
          $(document).off('keyup');
          // $('#restart').show();
          var winner = display_winner(player1, player2);
          update_winner(winner);
        }
      });
    };


    var move_listener = function() {
      $(document).on('keyup', function(event) {
        if (event.which == player1.letter) {
          player1.move();
        } else if (event.which == player2.letter) {
          player2.move();
        }
      });
    };

    move_listener();
    win_listener();

    $('#restart').on('click', function () {
      player1.reset();
      player2.reset();
      clear_table();
      move_listener();
      win_listener();
      // $(this).hide();
    });

  });



});

