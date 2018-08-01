/*prototypes.js*/

//prototype object for maps and their components
//consider going back to constructors... node.js doesn't show prototype stuff on console.log, so that makes debug tough.

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
	}

}

module.exports.mapProto = mapProto;