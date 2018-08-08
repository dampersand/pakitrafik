//test.js


window.onload = function() {
	let canvas = document.getElementById('mapCanvas');
	//TODO: experiment with these - canvas scaling
	canvas.width = 600;
	canvas.height = 400;
	canvas.style.height = 400;
	canvas.style.width = 400;
	let ctx = canvas.getContext('2d');

//arrow settings
let headwidth = 10;
let pointlength = 5;

let source = {
	"x" : 50,
	"y" : 200,
	"r" : 5
}

let dest = {
	"x" : 550,
	"y" : 100,
	"r" : 5
}

//calculate angle between source and destination
let x = source['x'] - dest['x'];
let y = source['y'] - dest['y'];
let hyp = Math.sqrt(Math.pow(y,2) + Math.pow(x,2));
let angle = Math.atan(y/x)

//edit angle a bit to work with javascript better
if (source['x'] >= dest['x']) {
	angle = angle + Math.PI
}

console.log(angle)
//create source and dest
ctx.fillStyle = 'white';
ctx.arc(source['x'],source['y'],source['r'],0,Math.PI * 2);
ctx.fill()
ctx.arc(dest['x'],dest['y'],source['r'],0,Math.PI * 2);
ctx.fill()

//draw an arrow
ctx.strokeStyle = 'white'
ctx.save();
ctx.translate(source['x'], source['y']);
ctx.rotate(angle);
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(hyp, 0);
ctx.lineTo(hyp - pointlength, 0 - (0.5 * headwidth));
ctx.lineTo(hyp - pointlength, 0.5 * headwidth);
ctx.lineTo(hyp,0);
ctx.stroke();
ctx.restore();
}
