get '/' do
  erb :index
end

post '/game/new' do
  player1 = Player.find_or_create_by_name(params[:player1])
  player2 = Player.find_or_create_by_name(params[:player2])
  game = Game.create
  game.players << player1 << player2

  puts "REDIRECTING TO /PLAY/GAMEID AGAIN"
  redirect "/play/#{game.id}"
end


get '/play/:gameid' do |gameid|
  erb :race
end

post '/play/:gameid/:winner' do |gameid, winner|
  puts gameid
  game = Game.find(gameid)
  winner = Player.find_by_name(winner)
  game.winner = winner.id
  game.save
end

get '/play/:gameid/player_names' do |gameid|
  content_type :json
  players = Game.find(gameid).players  
  players.map{|player| player.name}.to_json
end

get '/game/:gameid' do |gameid|
  game = Game.find(gameid)
  @winner = Player.find(game.winner)
  @time = game.time_to_win 
  erb :results
end
