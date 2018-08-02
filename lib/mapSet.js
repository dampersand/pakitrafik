/*mapSet.js*/

//this is a one-off object that serves as the in-memory map database (calling it a 'map set').

//const mapWorker = require ('./mapWorker.js'); defunct
const mapFactory = require('./mapFactory.js');
const Promise = require('promise');
const config = require("../config.js");

const mapSet = {
	maps : [],

	//adds a map to the mapset.  Synchronous, no need for a promise
	addMap(mapObj) {
		this.maps.push(mapObj);
	},

	//delete a map from the mapset.  Synchronous, no need for a promise.  does not delete file.
	deleteMap(index) {
		if (index <= (this.maps.length - 1)) {
			this.maps.splice(index,1);
		}
	},

	//TODO: add functions that expose individual maps for new requests and update map links via gatherer

	//initialize the mapset.  return a promise that resolves when mapset is initialized.
	initMapSet() {
		//clean array of maps
		this.maps = [];

		//get all new maps.  Return a promise that resolves when all maps are in the mapSet.  Remember to pass 'this' to the next function.
		return mapFactory.listMaps().then(function(mapList){
			
			let promises = [];

			//jam each map into mapSet
			for (index in mapList) {
				promises.push(mapFactory.newMapFromFile(mapList[index]).then(
					function(loadedMap){
						this.addMap(loadedMap)
					}.bind(this))
				);
			}

			//don't resolve this function until all maps are added!
			return Promise.all(promises)
		}.bind(this));
	},


};

module.exports.mapSet = mapSet;
