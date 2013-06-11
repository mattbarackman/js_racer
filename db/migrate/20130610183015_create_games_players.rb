class CreateGamesPlayers < ActiveRecord::Migration
  def change
    create_table :games_players do |t|
      t.references :player 
      t.references :game
    end
  end
end

