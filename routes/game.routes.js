
const gameController = require('../controllers/game.controller');

var express = require('express');
var router = express.Router();

// GET - Games ('/api/games')
router.get('/', gameController.getGames);

// GET - Game ('/api/games/:id')
router.get('/:id', gameController.getGame);

// POST - Add player ('/api/games/add-player')
router.post('/add-player', gameController.addPlayer);

// POST - Remove player ('/api/games/remove-player')
router.post('/remove-player', gameController.removePlayer);

module.exports = router;
