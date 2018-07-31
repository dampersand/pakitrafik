/*mapFactory.js*/

//Factory for creating map objects, and components therein
//This feels super weird.  I want to use these functions to create the object fully-formed, not empty versions.

const mapProto = require('./mapProto.js')

//factory function for empty prototypes
let emptyMap = function emptyMap() {
	return Object.create(mapProto) {
}

module.exports = {
	emptyMap
}