
const userController = require('../controllers/user.controller');

var express = require('express');
var router = express.Router();

// POST - Login ('/api/users/login')
router.post('/login',userController.login);

// GET - Users ('/api/users')
router.get('/', userController.getUsers);

// GET - User ('/api/users/:id')
router.get('/:id', userController.getUser);

// POST - Create user ('/api/users')
router.post('/', userController.createUser);

module.exports = router;
