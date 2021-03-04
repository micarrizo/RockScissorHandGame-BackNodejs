const Game = require('../models/Game')

exports.newGame = async (req, res) => {
    try {
        let games;
        games = new Game(req.body);
        await games.save()
        .then(response => res.send(response))
        //res.send('Game created') 
        
    } catch (error) {
        res.status(400).send('Error');
    }
}

exports.getGames = async (req, res) => {
    try {
        const games = await Game.find();
        res.json({ games });
    } catch (error) {
        res.status(400).send('Games can not be loaded');
    }
}

exports.updateGames = async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body  }, { new: true })
        res.json({ game })

        //console.log(game)
    } catch (error) {
        res.status(400).send('Game can not be updated');
    }
}

exports.deleteGame = async (req, res) => {
    try {
        let game = await Game.findById(req.params.id);
        if(!game){
            return res.status(404).json({msg: 'Game not found!'});
        }
        await Game.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Game deleted!' });

    } catch (error) {
        res.status(400).send('Game can not be deleted');
    }
}