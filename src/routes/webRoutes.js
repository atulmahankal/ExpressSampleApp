const express = require('express');
const router = express.Router();
const rootDirectory = process.cwd();
const path = require('path');

const verifySession = require(path.join(rootDirectory, 'src/middleware/verifySession'));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('auth/login', { title: 'Login' });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});

router.get('/dashboard', verifySession, function(req, res, next) {
  res.send(`Welcome, ${req.session.user.username}! <a href="/logout">Logout</a>`);
});

router.get('/category1/product2/1234', verifySession, function(req, res, next) {
  res.send(`you are viewing product page<br /> <a href="/logout">Logout</a>`);
});

module.exports = router;