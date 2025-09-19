function setup() {
  createCanvas(400, 300);
  background(220);
}

function draw() {
  fill(255, 0, 0);
  ellipse(mouseX, mouseY, 50, 50);
  
  fill(0);
  textSize(16);
  text('Move o mouse!', 10, 20);
}