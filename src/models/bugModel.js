var sql = require('sequelize');
var User = sequelize.define('Bug', {
  title: Sequelize.STRING,
  dateFiled: Sequelize.DATE
});
