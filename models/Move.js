const mongoose = require('mongoose');

const MoveSchema = mongoose.Schema({
    move: {
        type: String,
        required: true,
        trim: true,
    },
    kills: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Moves', MoveSchema)