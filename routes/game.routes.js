
const gameController = require('../controllers/game.controller');

var express = require('express');
var router = express.Router();

// GET - Games ('/api/games')
router.get('/', gameController.getGames);

// GET - Game ('/api/games/:id')
router.get('/:id', gameController.getGame);

// POST - Create game ('/api/games')
router.post('/', gameController.createGame);

// PUT - Update game ('/api/games')
router.put('/:id', gameController.updateGame);

// PUT - Conquer cell ('/api/games')
router.put('/:id/conquer-cell', gameController.conquerCell);

// DELETE - Delete game ('/api/games')
router.delete('/:id', gameController.deleteGame);

module.exports = router;
