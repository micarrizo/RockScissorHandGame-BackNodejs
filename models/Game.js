const mongoose = require('mongoose');

const MatchSchema = mongoose.Schema({
	move_player_one: { type: String, required: true }, 
	move_player_two: { type: String, required: true }, 
	winner:     { type: String, required: true }
})

const RoundSchema = mongoose.Schema({
	matches:  [ MatchSchema ],
    winner:  { type: String, required: false },
	looser:  { type: String, required: false },
})

const GameSchema = mongoose.Schema({
	player_one: { type: String, required: true }, 
	player_two: { type: String, required: true }, 
	rounds:     [ RoundSchema ],
	n_rounds: { type: Number, required: true },
	started_at: { type: Date, default: new Date(), required: false },
	ended_at: { type: Date, default: "", required: false },
	game_finished: { type: Number, default: 0, required: false },
}) 

module.exports = mongoose.model('Games', GameSchema)