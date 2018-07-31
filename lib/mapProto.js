/*mapProto.js*/

//prototype object for maps and their components

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
		"name"			: "",
		"fileName"	: ""
	}

	function addNode(options) {
		let newNode = Object.create(nodeProto)
		for (option in options) {
			if (option in nodeProto) {
				newNode.option = options.option;
			}
		}
		this.nodes.push(newNode);
	}

	function deleteNode(index) {
		if (index <= (nodes.length - 1)) {
			this.nodes.splice(index,1);
		}
	}

	function addLink(options) {
		let newLink = Object.create(linkProto)
		for (option in options) {
			if (option in linkProto) {
				newLink.option = options.option;
			}
		}
		this.links.push(newLink);
	}

	function deleteLink(index) {
		if (index <= (links.length - 1)) {
			this.links.splice(index,1);
		}
	}

}

module.exports.mapProto = mapProto;