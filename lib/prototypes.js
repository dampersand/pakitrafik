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
	"size"			: 1,
	"img"				: ""  
}

const linkProto = {
	"source"		: null,
	"dest"			: null
}

const mapProto = {
	"nodes" : [],
	"links" : [],
	"meta" : {
		"checksum"	: 0,
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

	//calculates the map's checksum.  Expects directory.  Returns a promise when the checksum is calculated.
	calculateChecksum(directory = config.package.mapDirectory) {
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
	loadMap(directory = config.package.mapDirectory) {
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
			for (entry in mapData) {
				this[entry] = mapData[entry]; //TODO: consider what this might erase.  anything important?  What if the file has some garbage in it?  Is it possible to rewrite a function here?  Might be good to inherit from a prototype with the methods and call object.freeze
			}
			this['meta']['checksum'] = result[0];
		}.bind(this));
	},

	//save the map to its file.  Return a promise when map is saved.
	saveMap(directory = config.package.mapDirectory) {

		//strip checksum - don't want to save this, or it'll create load/save loops on manual editing
		delete this['meta']['checksum'];

		//turn the map into string and jam it into file
		let mapString = JSON.stringify(this);

		return new Promise(function(resolve,reject){
			fs.writeFile(directory + "/" + this.meta.fileName, mapString, function(err, data) {
				if (err) { //TODO: error checking here
					return reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

}

module.exports.mapProto = mapProto;