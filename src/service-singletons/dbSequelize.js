var client = require('sequelize');
var sequelize = new client('database', 'username', 'pw');


/**
 * example
 * userModel.js
 */


/**
 * example
 * userController.js
 */
// var User = sequelize.define('User', {
//   username: Sequelize.STRING,
//   birthday: Sequelize.DATE
// });
//
// sequelize.sync().then(function() {
//   return User.create({
//     username: 'janedoe',
//     birthday: new Date(1980, 6, 20)
//   });
// }).then(function(jane) {
//   console.log(jane.get({
//     plain: true
//   }))
// });
