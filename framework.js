const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 900;

let x, y, lastX, lastY, color;
x = y = lastX = lastY = 0;
color = "transparent";

function setX(newX) {
	lastX = x;
	x = newX;
}

function setY(newY) {
	lastY = y;
	y = newY;
}

function _center() {
	setX(canvas.width / 2);
	setY(canvas.height / 2);
}

ctx.beginPath();

function _draw() {
	ctx.moveTo(lastX, lastY);
	ctx.lineTo(x, y);
	ctx.strokeStyle = color;
	ctx.stroke();
}

function _left(distance) {
	setX(x - distance);
}

function _right(distance) {
	setX(x + distance);
}

function _top(distance) {
	setY(y - distance);
}

function _bottom(distance) {
	setY(y + distance);
}

function _setColor(newColor) {
	color = newColor;
}
