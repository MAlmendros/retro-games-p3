var express = require('express');
var router = express.Router();

// GET - Home page ('/')
router.get('/', function(request, response, next) {
  response.render('home', { title: 'RetroGames' });
});

// GET - Room page ('/room')
router.get('/room', function(request, response, next) {
  response.render('room', { title: '¡A jugar!' });
});

// GET - Login page ('/login')
router.get('/login', function(request, response, next) {
  response.render('login', { title: 'Inicio de sesión' });
});

// GET - Register ('/register')
router.get('/register', function(request, response, next) {
  response.render('register', { title: 'Registro' });
});

module.exports = router;
