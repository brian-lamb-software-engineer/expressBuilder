var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/mmdb');

// Use native promises
// mongoose.Promise = global.Promise;
// assert.equal(query.exec().constructor, global.Promise);

// Use bluebird
mongoose.Promise = require('bluebird');

// var assert = require('assert');
// assert.equal(query.exec().constructor, require('bluebird'));
