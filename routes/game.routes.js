
const gameController = require('../controllers/game.controller');

var express = require('express');
var router = express.Router();

// GET - Games ('/api/games')
router.get('/', gameController.getGames);

// GET - Game ('/api/games/:id')
router.get('/:id', gameController.getGame);

// PUT - Add player ('/api/games/:gameId/add-user/:userId')
router.put('/:gameId/add-user/:userId', gameController.addPlayer);

// PUT - Remove player ('/api/games/:gameId/remove-user/:userId')
router.put('/:gameId/remove-user/:userId', gameController.removePlayer);

module.exports = router;
