
const gameController = require('../controllers/game.controller');

var express = require('express');
var router = express.Router();

// GET - Games ('/api/games')
router.get('/', gameController.getGames);

// GET - Game ('/api/games/:id')
router.get('/:id', gameController.getGame);

// POST - Create game ('/api/games')
router.post('/', gameController.createGame);

// DELETE - Delete game ('/api/games')
router.post('/', gameController.deleteGame);

module.exports = router;
