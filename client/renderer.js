//renderer.js
//contains functions for rendering a map

//expects a link object and context, draws an arrow
function drawArrow(linkObj,ctx) {

	let headWidth;
	let pointerLength;
	let arrowWidth;

	//TODO: set arrowtype cases here.
	switch(linkObj.arrowType) {
		case 0:
			headWidth = 20;
			arrowWidth = 5;
			pointerLength = 5;
			break;
	}

	//determine source and destination angle
	let x = linkObj.source.x - linkObj.dest.x;
	let y = linkObj.source.y - linkObj.dest.y;
	let hyp = Math.sqrt(Math.pow(y,2) + Math.pow(x,2));
	let angle = Math.atan(y/x);

	//normalize angle
	if (linkObj.source.x >= linkObj.dest.x) {
		angle = angle + Math.PI;
	}

	//determine color of arrow
	//TODO: percentage-scale colors.  for now, use white.
	ctx.strokeStyle = 'black';
	ctx.fillStyle = 'white';

	//draw the arrow
	//TODO: turn result into a path2d object so we can redraw it with different colors as the case may be
	ctx.save();
	ctx.translate(linkObj.source.x,linkObj.source.y);
	ctx.rotate(angle);
	ctx.beginPath();
	ctx.moveTo(0,arrowWidth);
	ctx.lineTo(hyp - pointerLength, arrowWidth);
	ctx.lineTo(hyp - pointerLength, headWidth * 0.5);
	ctx.lineTo(hyp, 0);
	ctx.lineTo(hyp - pointerLength, 0 - (0.5 * headWidth));
	ctx.lineTo(hyp - pointerLength, 0 - arrowWidth);
	ctx.lineTo(0, 0 - arrowWidth);
	ctx.lineTo(0, arrowWidth);
	ctx.stroke();
	ctx.fill();
	ctx.restore();
}

//expects a node object and context, draws the node
//TODO: currently just drawing points.
function drawNode(nodeObj,ctx){

	ctx.fillStyle = 'white';
	ctx.arc(nodeObj.x,nodeObj.y,5,0,Math.PI * 2);
	ctx.fill();
	ctx.arc(nodeObj.x,nodeObj.y,5,0,Math.PI * 2);
	ctx.fill();

}

window.onload = function() {
	let canvas = document.getElementById('mapCanvas');
	let ctx = canvas.getContext('2d');
}
