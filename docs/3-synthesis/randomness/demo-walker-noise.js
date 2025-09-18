var d = 24;
var inc = 0.01;
var off1 = 0;
var off2 = 10000;

function setup() {
  createCanvas(400, 240);
}

function draw() {
  background(255);
  fill(55);

  var x = map(noise(off1), 0, 1, 0, width);
  var y = map(noise(off2), 0, 1, 0, height);

  off1 += inc;
  off2 += inc;

  ellipse(x, y, d, d);

}

