$(document).ready(function() {

  var MAX_POSITION = 30;

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

  var player1 = new Player('1','Maria', 'J');
  var player2 = new Player('2','Matt', 'D');

  function display_winner(player1, player2) {
    if (player1.is_winner()) {
      $('#winner').text(player1.display() +" " + player2.display());
    } else if (player2.is_winner()) {
      $('#winner').text(player2.display() +" " + player1.display());
    }
  }

  var win_listener = function () {
    $(document).on('keyup', function(event){
      if (player1.is_winner() || player2.is_winner()){
        $(document).off('keyup');
        $('#restart').show();
      }
      display_winner(player1, player2);
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
    $(this).hide();
  });

});
