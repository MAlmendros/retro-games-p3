
const roomController = require('../controllers/room.controller');

var express = require('express');
var router = express.Router();

// GET - Rooms ('/api/rooms')
router.get('/', roomController.getRooms);

// GET - Room ('/api/rooms/:id')
router.get('/:id', roomController.getRoom);

// POST - Add player ('/api/rooms/add-player')
router.post('/add-player', roomController.addPlayer);

// POST - Remove player ('/api/rooms/remove-player')
router.post('/remove-player', roomController.removePlayer);

module.exports = router;
