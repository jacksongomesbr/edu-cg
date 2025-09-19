var d = 24;
var w = d / 2;
var h = d / 2;
var x0 = 0;
var y0 = 0;
var xadj = 0 + w + 1;
var yadj = 0 + h + 1;

function setup() {
  createCanvas(400, 240);
}

function draw() {
  background(255);
  fill(55);
  var x = random(xadj, width - xadj);
  var y = random(yadj, height - yadj);
  ellipse(x, y, d, d);
}

