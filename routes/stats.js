const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

//Player
router.get('/player/:id/matches-won', statsController.getPlayerMatchesWon);
router.get('/player/:id/most-used-moves', statsController.getPlayerMostUsedMoves);
// //Games
router.get('/games/most-picked-move-first-game', statsController.getMostPickedMoveFirstGame);
router.get('/games/average-time', statsController.getAverageTimeGame);
// //Matches
router.get('/matches/average-quantity-takes-to-complete', statsController.getAverageQGamesToComplete);
router.get('/matches/percentage-complete-incomplete', statsController.getPercentajeCompleteIncomplete);

router.get('/matches/matrix', statsController.getMatrix);

module.exports = router;