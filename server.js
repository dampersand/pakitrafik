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


//this is all testing: none of this should be how the final product is served.  Just taking notes as I go.

//handle get requests.  gets take precedent over posts, because I said so.
app.get('/', function(req, res, next) {
	if (req.query.checksum) {res.locals.checksum = req.query.checksum};
	if (req.query.map) {res.locals.map = req.query.map};
	res.sendFile('public/pakitrafik.html');
	next();
});

//temporary testing function that exposes everything in the 'client' subdirectory
//in reality, we should probably be using Pug to template this all out.
app.use(express.static('public'));

//next set of code goes here - determine if map exists, if checksum is correct, etc
//app.use

//error logging... eventually
app.use(function(err, req, res, next) {
	res.sendStatus(500);
});

app.listen(config.redis.port);
