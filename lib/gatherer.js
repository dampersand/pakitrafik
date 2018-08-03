/*gatherer.js*/

//provides gatherer object - this is an object that loads plugins and provides methods for talking to the database
//TODO: all kinds of error checking... did the plugin load correctly? did init finish?

const config = require('../config.js');
const plugin = Object.create(require('../plugins/' + config.database.plugin).plugin);

const gatherer = {
	
	//initialize the gatherer
	init() {
		//load up the plugin
		plugin.init();
	},

	//wrapper for the plugin's 'query' function.
	//returns the promise from plugin.query, in case someone externally needs to work with plugin.
	getValue(valueSource) {
		//TODO: possible input sanitization?
		//TODO: error checking.  Plugin may send some garbage data.
		return plugin.query(valueSource);
	},

	//send multiple queries to the plugin for all link values in a map object.  Returns a promise with the updated map attached when complete.
	getMapValues(map) {

		let promises = [];
		//using a closure to pass linkIndex into internalIndex
		for (linkIndex in map.links) {
			(function(internalIndex) {

				//if the link in the index being tested has a valueSource attached...
				if ('valueSource' in map.links[internalIndex]) { //TODO: better sanitization, checking to see if valueSource is empty or not, etc
					promises.push(plugin.query(map.links[internalIndex]['valueSource']).then(

						//update the map with the reqult of the query
						function(queryResult){
							map.links[internalIndex]['value'] = queryResult['value'];
							map.links[internalIndex]['time'] = queryResult['time'];
						}
					));
				}
			})(linkIndex);
		}

		//once all the promises are done, have the promise.all function return a promise with the updated map object attached
		//I... think this is how this is done?
		return Promise.all(promises).then(function(){
			return map;
		});
	}

}

module.exports.gatherer = gatherer;