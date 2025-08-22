var halfHeight;

function setup() {
  createCanvas(400, 200);
  halfHeight = height / 2;
}

function draw() {
  background(255);
  point(10, halfHeight);
  line(50, halfHeight, 150, halfHeight);
  circle(200, halfHeight, 50);
  rect(250, halfHeight - 25, 50, 50);
  triangle(325, halfHeight + 25, 350, halfHeight - 25, 375, halfHeight + 25);
}
