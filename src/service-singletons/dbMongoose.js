// Going with "mm", for Mongoose Mapper)
var mm = require('mongoose');
mm.connect('mongodb://127.0.0.1/mmdb');

// Use native promises, or use bluebird below, which is highly recommended
// mm.Promise = global.Promise;
// assert.equal(query.exec().constructor, global.Promise);

// Use bluebird (needs to be defined to "Promise", which is default Promise obj)
mm.Promise = require('bluebird');
