class Ball {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.radius = this.diameter / 2;
    this.vector = createVector(this.x, this.y);
  }
  draw() {
    circle(this.x, this.y, this.diameter);
    drawArrow(v0, this.vector, "green", "ball");
  }
}
let ball;
let v0;
function setup() {
  createCanvas(400, 400);
  ball = new Ball(width / 2, height / 2, 50);
  v0 = createVector(0, 0);
}

function draw() {
  background(220);
  let mouse = createVector(mouseX, mouseY);
  drawArrow(v0, mouse, "red", "mouse");
  ball.draw();
  let diff = p5.Vector.sub(mouse, ball.vector);
  drawArrow(ball, diff, 'blue', 'mouse - ball');
}

function drawArrow(base, vec, myColor, label) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);

  translate(base.x, base.y); //Will transport the object line (below) to the tip of the positional vector v1
  line(0, 0, vec.x, vec.y); //The line from the O to the tip of v1

  push();
  translate(vec.x / 2, vec.y / 2);
  textSize(15);
  strokeWeight(0);
  if (label) {
    text(label, 0.2, 0);
  }
  pop();

  rotate(vec.heading()); //Rotates the following triangle the angle of v1
  let arrowSize = 10; // Determines size of the vector arrowhead (triangle).
  translate(vec.mag() - arrowSize, 0); //Will translate a triangle below by the modulus of v1
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
