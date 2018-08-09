/*prototypes.js*/

//prototype object for maps and their components

//requirements
const fs = require("fs");
const checksum = require("checksum");
const Promise = require("promise");

//config
const config = require("../config.js");

const nodeProto = {
	"x" 				: 0,
	"y" 				: 0,
	"name"			: "",
	"mouseover"	: null,
	"scale"			: 1,
	"img"				: ""  
}

const linkProto = {
	"source"				: {
		"x"						: null,
		"y"						: null  
	},
	"dest"					: {
		"x"						: null,
		"y"						: null 
	},
	"valueSource"		: {},
	"arrowType"			: 0
}

const mapProto = {
	"nodes" : [],
	"links" : [],
	"meta" : {
		"checksum"	: 0,
		"id"				: "", 
		"label"			: "", 
		"fileName"	: ""
	},

 addNode(options) {
		let newNode = Object.create(nodeProto)
		for (option in options) {
			if (option in nodeProto) {
				newNode[option] = options[option];
			}
		}
		this.nodes.push(newNode);
	},

	deleteNode(index) {
		if (index <= (this.nodes.length - 1)) {
			this.nodes.splice(index,1);
		}
	},

	addLink(options) {
		let newLink = Object.create(linkProto)
		for (option in options) {
			if (option in linkProto) {
				newLink[option] = options[option];
			}
		}
		this.links.push(newLink);
	},

	deleteLink(index) {
		if (index <= (this.links.length - 1)) {
			this.links.splice(index,1);
		}
	},

	//calculates the map's checksum from its file.  Expects directory.  Returns a promise when the checksum is calculated.
	calculateChecksum(directory = config.settings.mapDirectory) {
		return new Promise(function(resolve, reject) {
			checksum.file(directory + "/" + this.meta.fileName, function(err,sum) {
				if (err) { //TODO: error checking here
					return reject(err);
				} else {
					resolve(sum);
				}
			});
		}.bind(this));
	},

	//load the map from its file.  Return a promise when map is loaded.
	loadMap(directory = config.settings.mapDirectory) {
	//asynchronously get checksum of map and read map from file
		return new Promise.all([
			this.calculateChecksum(directory), 
			new Promise(function(resolve,reject) {
				fs.readFile(directory + "/" + this.meta.fileName, 'utf8', function(err, data) {
					if (err) { //TODO: error checking here
						return reject(err);
					} else {
						resolve(data);
					}
				});
			}.bind(this))
		]).then(function(result){ //after reading file and getting checksum, update map object
			let mapData = JSON.parse(result[1]);

			//parse nodes and links, create new objects for them to preserve prototypes/backwards compatibility
			//TODO: consider what this might erase.  anything important?  What if the file has garbage in it?
			if ('nodes' in mapData) {
				for (node in mapData['nodes']) {
					this.addNode(mapData['nodes'][node]);
				}
			}
			if ('links' in mapData) {
				for (link in mapData['links']) {
					this.addLink(mapData['links'][link]);
				}
			}

			//add checksum here.  This only exists in memory, never in file.
			this['meta']['checksum'] = result[0];

		}.bind(this));
	},

	//save the map to its file.  Return a promise when map is saved.
	saveMap(directory = config.settings.mapDirectory) {

		//strip checksum - don't want to save this, or it'll create load/save loops on manual editing
		delete this['meta']['checksum'];

		//strip any link values, we don't need to save them and possibly ruin checksums
		for (index in this.links) {
			delete this.links[index][value];
		}

		//turn the map into string and jam it into file
		let mapString = JSON.stringify(this);

		return new Promise(function(resolve,reject){
			fs.writeFile(directory + "/" + this.meta['fileName'], mapString, function(err, data) {
				if (err) { //TODO: error checking here
					return reject(err);
				} else {
					resolve(data);
				}
			});
		}.bind(this));
	},

	//edit meta contents.  Expects an object full of keys to be added.
	//TODO: decide if there needs to be sanitation here.
	editMeta(options) {
		for (option in options) {
			if (option in this.meta) {
				this.meta[option] = options[option]
			}
		}
	}

}

module.exports.mapProto = mapProto;