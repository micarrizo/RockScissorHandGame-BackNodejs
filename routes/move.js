const express = require('express');
const router = express.Router();
const moveController = require('../controllers/movesController');

router.post('/', moveController.newMove);

router.get('/', moveController.getMoves) 

router.put('/:id', moveController.updateMove)

router.delete('/:id', moveController.deleteMove)

module.exports = router;