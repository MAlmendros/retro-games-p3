
const userController = require('../controllers/user.controller');

var express = require('express');
var router = express.Router();

router.post('/login',userController.login);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);

module.exports = router;
