/*server.js*/

//constants and instantiations
const express = require('express');
const app = express();

var config = ('./config');

var test = new Date();
var testSec = test.getSeconds();

//Get checksums of initial map files
app.get('/', (req, res) => {
	console.log(req);
	res.send(testSec);
})

//error logging
app.use((err, req, res, next) => {
	res.status(500).send('Will be fleshing out errors here...')
});

app.listen(config.redis.port);