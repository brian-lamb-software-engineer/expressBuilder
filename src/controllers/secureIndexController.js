/**
 * This page was implemented to test some authorization and security
 * i have yet to determine if an index page is needed, and speculate that if one
 * is needed, that might make this a good index page
*/
var express = require('express');
var router = express.Router();
var auth = require('./js/authService.js');
// var products = require('./products.js');
var user = require('./js/userController.js');

/*
 * Routes that can be accessed by any one (TEST routes at this point, and i
 * think this is why th index is broken currently. )
 */
router.post('/login', auth.login);
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
 * TEST Routes that can be accessed only by autheticated users (there are NO products)
 */
router.get('/api/v1/products', products.getAll);
router.get('/api/v1/product/:id', products.getOne);
router.post('/api/v1/product/', products.create);
router.put('/api/v1/product/:id', products.update);
router.delete('/api/v1/product/:id', products.delete);

/*
 * TEST Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/v1/admin/users', user.getAll);
router.get('/api/v1/admin/user/:id', user.getOne);
router.post('/api/v1/admin/user/', user.create);
router.put('/api/v1/admin/user/:id', user.update);
router.delete('/api/v1/admin/user/:id', user.delete);

module.exports = router;
