/*mapFactory.js*/

//Factory for creating map objects, and components therein
//This feels super weird.  I want to use these functions to create the object fully-formed, not empty versions.

const prototypes = require('./prototypes.js')

//factory function for empty prototypes
let newMap = function newMap() {
	return Object.create(prototypes.mapProto)
}

module.exports = {
	newMap
}