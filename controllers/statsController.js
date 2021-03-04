const Game = require('../models/Game');
const Move = require('../models/Move')
const mongoose = require('mongoose');

exports.getPlayerMatchesWon = async (req, res) => {
    const ObjectId = mongoose.Types.ObjectId;
    const newGame = req.params.id
    const data = req.body
    
    try {
        const game = await Game.aggregate([
            { $unwind: '$rounds' },
            { $match: { _id: ObjectId(newGame) } },
            {
                $project: {
                    '_id': 0,
                    'matches': '$rounds.matches',
                    'q_matches': { $size: '$rounds.matches' }
                }
            },
            { $unwind: '$matches' },
            {
                $project: {
                    'winner': '$matches.winner',
                    'q_matches': '$q_matches'
                }
            },
            {
                $group: {
                    '_id': { 'winner': '$winner', 'q_matches': '$q_matches' },
                    'q_won': { $sum: 1 }
                }
            },
            {
                $project: {
                    '_id': 0,
                    'winner': '$_id.winner',
                    'won_rate': { $round: [{ $multiply: [{ $divide: ['$q_won', '$_id.q_matches'] }, 100] }, 100] }
                }
            }
        ])
        
        res.json({ game })
    } catch (error) {
        res.status(400).send('Games can not be loaded');
    }
}

//Get Functions
exports.getPlayerMostUsedMoves = async (req, res) => {
    const ObjectId = mongoose.Types.ObjectId;
    const newGame = req.params.id
    //const data = req.body
    try {
        const gameMostUsedMove = await Game.aggregate([
            {$unwind: '$rounds'},
            {$match: { _id: ObjectId(newGame) } },
            {$unwind: '$rounds.matches'},
            {$project: {
                "_id": "$_id",
                "move_pone": "$rounds.matches.move_player_one"
            }},
            {$group: {
                "_id": "$move_pone",
                "move_count": {$sum: 1}
            }},
            {$project: {
                "_id": 0,
                "move": "$_id",
                "move_count": "$move_count"
            }},
            {$sort: {move_count: -1}},
            {$limit: 1},
            {$project: { "move_count": 0 }}
        ])
        res.json({ gameMostUsedMove })
    } catch (error) {
        res.status(400).send('Games can not be loaded');
    }
}


exports.getMostPickedMoveFirstGame = async (req, res) => {
    try {
        const gameMostPickedMoveFirstGame = await Game.aggregate([
            {$unwind: '$rounds'},
            {$project: {
               '_id': 0,
               'first_move': {$arrayElemAt: [ '$rounds.matches', 0 ]}
            }},
            {$project: {
               'move': '$first_move.move_player_one'    
            }},
            {$group: {
               '_id': '$move',
               'count': {$sum: 1}    
            }},
            {$project: {
              '_id': 0,
              'move': '$_id',
              'count': '$count'    
            }},
            {$sort: {'count': -1}},
            {$limit: 1},
            {$project: {
              'move': 1    
            }}
        ])
        const move = await Move.find(
            { move: gameMostPickedMoveFirstGame[0].move },
            {_id: 0, img: 1}
        )
        res.json(move[0].img)
    } catch (error) {
        res.status(400).send('Games can not be loaded');
    }
    
}

exports.getAverageTimeGame = async (req, res) => {
    try {
        const gameAverageTimeGame = await Game.aggregate([
            { $match: { game_finished: 1 } },
            {$project: {
                '_id': 0,
                'long_game_min' : { $divide: [{ $subtract: [ "$ended_at", "$started_at" ] }, 60000] }
             }},  
             {$group: {
                '_id': 1,
                'q_games': {$sum: 1},
                'sum_long_game_min': {$sum: '$long_game_min'}
             }},
             {$project: {
                '_id': 0,
                'average_time_games_minutes': { $divide: [ '$sum_long_game_min', '$q_games'] }
              }},
        ])
        res.json(gameAverageTimeGame[0])
    } catch (error) {
        res.status(400).send('Games can not be loaded');
    }
}

exports.getAverageQGamesToComplete = async (req, res) => {
    try {
        const averageQGamesToComplete = await Game.aggregate([
            { $match: { game_finished: 1 } },
            { $unwind: '$rounds'},
            {$project: {
                '_id': "$_id",
                'rounds': { $size:'$rounds.matches' } 
            }},
            {$group: {
                '_id': 0,
                'q_matches': {$sum: '$rounds'},
                'q_games': {$sum: 1},
             }},
             {$project: {
                '_id': 0,
                'average_quantity': { $divide: [ '$q_matches', '$q_games'] },
                'q_matches' : '$q_matches',
                'q_games' : '$q_games'
              }},
        ])
        res.json(averageQGamesToComplete[0])
    } catch (error) {
        res.status(400).send('Games can not be loaded');
    }
}

exports.getPercentajeCompleteIncomplete = async (req, res) => {
    try {
        const completed = await Game.aggregate([
            { $match: { game_finished: 1 } },
            {$group: {
                '_id': 0,
                'completed': {$sum: 1},
             }},
        ])
        const incomplete = await Game.aggregate([
            { $match: { game_finished: 0 } },
            {$group: {
                '_id': 0,
                'incomplete': {$sum: 1},
             }},
        ])
        res.json({ completed: completed[0].completed ,incompleted: incomplete[0].incomplete })
    } catch (error) {
        res.status(400).send('Games can not be loaded');
    }
}

exports.getMatrix = async (req, res) => {
    try {
        const matrix = await Game.aggregate([
            { '$unwind' : '$rounds' },
            { '$unwind' : '$rounds.matches' },
            { '$project' : {
                '_id': 0,
                'move_player_one': '$rounds.matches.move_player_one',
                'move_player_two': '$rounds.matches.move_player_two'
            }},
            { '$group' : {
                '_id' : { 'pone' : '$move_player_one', 'ptwo' : '$move_player_two' },
                'count' : { '$sum' : 1 }
            }},
            { '$project' : {
                '_id' : 0,
               'pone' : '$_id.pone',
               'ptwo' : '$_id.ptwo',
               'count' : '$count' 
             }},
             { '$group' : {     
                 '_id' : '$pone',
                 'data' : { '$push' : { 'x' : '$ptwo', 'y': '$count'} }
              }},
              { '$project' : {
                '_id' : 0,
               'name' : '$_id',
               'data' : '$data'
             }},
            
        ])
        const names = matrix.map(x => x.name)
        const data = [];
        names.forEach(name => {
            const records = [];
            const d = matrix.filter(x => x.name === name)[0].data;
            names.forEach(name2 => {
                const dato = d.filter(item => item.x === name2);
                const registro = dato.length > 0 ? dato[0] : { x: name2, y: 0 };
                records.push(registro);
            })
            data.push({ name: name, data: records })
        });
        res.status(200).json(data);
    } catch (error) {
        
    }
}