const Move = require('../models/Move')

exports.newMove = async (req, res) => {
    //console.log(req.body);
    try {
        const move = new Move(req.body);
        await move.save();

        res.send('Move created')
    } catch (error) {
        console.log(error);
        res.status(400).send('Error');
    }
}

exports.getMoves = async (req, res) => {
    try {
        const moves = await Move.find();
        res.json({ moves });
    } catch (error) {
        res.status(400).send('Moves can not be loaded');
    }
}

exports.updateMove = async (req, res) => {
    const { move, kills, img } = req.body;
    const newMove = {};
    
    if(move){
        newMove.move = move;
        newMove.kills = kills;
        newMove.img = img;
    }

    try {
        let move = await Move.findById(req.params.id);
        if(!move){
            return res.status(404).json({msg: 'Move not found!'});
        }
        move = await Move.findByIdAndUpdate({ _id: req.params.id }, { $set: newMove  }, { new: true });
        res.json({ move })

    } catch (error) {
        res.status(400).send('Move can not be updated');
    }
}

exports.deleteMove = async (req, res) => {
    try {
        let move = await Move.findById(req.params.id);
        if(!move){
            return res.status(404).json({msg: 'Move not found!'});
        }
        await Move.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Move deleted!' });

    } catch (error) {
        res.status(400).send('Move can not be deleted');
    }
}