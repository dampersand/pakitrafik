/*server.js*/

//external dependencies
const express 	= require('express');
const app				= express();

//the one-off mapSet object
let mapSet = Object.create(require('./lib/mapSet.js').mapSet);
let gatherer = Object.create(require('./lib/gatherer.js').gatherer);

//config files
const config 			= require('./config.js');

mapSet.init()
gatherer.init()
//we also need a way to scan for any deleted maps, and destroy the object if so.
//map objects should include a function to re-check checksums.


//handle post requests
app.post('/', function(req, res, next) {
	if (req.body.checksum) {res.locals.checksum = req.body.checksum};
	if (req.body.map) {res.locals.map = req.body.map};
	next();
});

//handle get requests.  gets take precedent over posts, because I said so.
app.get('/', function(req, res, next) {
	if (req.query.checksum) {res.locals.checksum = req.query.checksum};
	if (req.query.map) {res.locals.map = req.query.map};
	next();
});

//next set of code goes here - determine if map exists, if checksum is correct, etc
//app.use

//error logging... eventually
app.use(function(err, req, res, next) {
	res.sendStatus(500);
});

app.listen(config.redis.port);
