var mongoose = require('mongoose');
var uri = 'mongodb://127.0.0.1/mmdb';

// native promises
//mongoose.connect(uri);

//default method) (or leave all commented for default)
////@TODO should need both this and the following?
mongoose.Promise = global.Promise;
// assert.equal(query.exec().constructor, global.Promise);

/**
 * Plugging in Blueburd.js(highly recommended)
 * There is a couple different ways, working on one, while holding onto what
 * works, until the slimmest is found.
 */
// method 1)
var options = { promiseLibrary: require('bluebird') };
mongoose.connect(uri, options);
// method 2)
// needs to be defined to "Promise", which is default Promise obj
//mongoose.Promise = require('bluebird');
