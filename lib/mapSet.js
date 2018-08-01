/*mapSet.js*/

//this is a one-off object that serves as the in-memory map database (calling it a 'map set').

const mapWorker = require ('./mapWorker.js');
const mapFactory = require('./mapFactory.js');
const Promise = require('promise');
const config = require("../config.js");

const mapSet = {
	maps : [],

	//adds the map in a given file to the mapset.  returns a promise in case you need to see if stuff is done.  Allows for future error handling.
	addMapFromFile(file, directory = config.package.mapDirectory) {
		return mapWorker.loadMap(file, directory).then(function(map) {
			this.maps.push(map);
		}.bind(this));
	},

	//create a fresh map from the factory
	addNewMap() {
		this.maps.push(mapFactory.newMap());
	},

	//delete a map from the mapset
	deleteMap(index) {
		if (index <= (this.maps.length - 1)) {
			this.maps.splice(index,1);
		}
	},

	//TODO: add functions that expose individual maps for new requests and update map links via gatherer

	//initialize the mapset.  return a promise that resolves when mapset is done.
	initMapSet() {
		//clean array of maps
		this.maps = [];

		//get all new maps.  Return a promise that resolves when all maps are in the mapSet.  Remember to pass 'this' to the next function.
		return mapWorker.listMaps().then(function(mapList){
			
			let promises = [];

			//jam each map into mapSet
			for (index in mapList) {
				promises.push(this.addMapFromFile(mapList[index]));
			}
			//don't resolve this function until all maps are added!
			return Promise.all(promises);
		}.bind(this));
	},


};

module.exports.mapSet = mapSet;
