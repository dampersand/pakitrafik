/*mapFactory.js*/

//Factory for creating map objects, and components therein
//This feels super weird.  I want to use these functions to create the object fully-formed, not empty versions.

const prototypes = require('./prototypes.js')

//factory function for empty prototypes
let newMap = function newMap() {
	let date = new Date();
	let now = String(date.now());
	let map = Object.create(prototypes.mapProto);
	map.meta.shortName = now;
	return map;
}

module.exports = {
	newMap
}