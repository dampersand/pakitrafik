/*gatherer.js*/

//provides gatherer object - this is an object that loads plugins and provides methods for talking to the database
//TODO: all kinds of error checking... did the plugin load correctly? did init finish?

const config = require('../config.js');
const plugin = Object.create(require('../plugins/' + config.database.plugin).plugin);

const gatherer = {
	init() {
		plugin.init();
	}
}

module.exports.gatherer = gatherer;