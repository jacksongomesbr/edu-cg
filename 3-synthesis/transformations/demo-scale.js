function setup() {
  createCanvas(400, 400);
}
function draw() {
  background(255);
  push();
  translate(width / 2, height / 2);
  scale(1.5, 0.5);
  rectMode(CENTER);
  rect(0, 0, 100, 100);
  pop();
}