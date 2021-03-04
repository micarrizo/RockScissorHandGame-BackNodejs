const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');


router.post('/', gameController.newGame);

router.get('/', gameController.getGames) 

router.put('/:id', gameController.updateGames)

router.delete('/:id', gameController.deleteGame)

module.exports = router;