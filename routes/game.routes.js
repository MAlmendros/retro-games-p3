
const gameController = require('../controllers/game.controller');

var express = require('express');
var router = express.Router();

router.get('/', gameController.getGames);
router.get('/:id', gameController.getGame);
router.put('/:gameId/add-user/:userId', gameController.addPlayer);
router.put('/:gameId/remove-user/:userId', gameController.removePlayer);

module.exports = router;
