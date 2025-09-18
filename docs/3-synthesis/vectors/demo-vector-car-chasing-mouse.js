class Car {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.radius = this.diameter / 2;
    this.angle = 0;
  }
  getVector() {
    return createVector(this.x, this.y);
  }
  draw() {
    push();
    if (this.angle) {
      translate(this.x, this.y);
      rotate(this.angle);
    }
    rectMode(CENTER);
    rect(0, 0, 40, 20);

    pop();
    drawArrow(null, this.getVector(), "green", "car");
  }
  update(x, y) {
    this.x += x;
    this.y += y;
  }
}
let car;
let v0;
function setup() {
  createCanvas(400, 400);
  car = new Car(width / 2, height / 2, 50);
  v0 = createVector(0, 0);
}

function draw() {
  background(220);
  let mouse = createVector(mouseX, mouseY);
  drawArrow(null, mouse, "red", "mouse");
  let diff = p5.Vector.sub(mouse, car.getVector());
  if (diff.mag() > 1) {
    let diffNorm = p5.Vector.normalize(diff); // .mult(2);
    car.update(diffNorm.x, diffNorm.y);
  }
  car.angle = diff.heading();
  car.draw();
  drawArrow(car, diff, "blue", "mouse - car");

  text(`mouse = (${mouse.x}, ${mouse.y})`, 10, 20);
  text(`car = (${car.x.toFixed(2)}, ${car.y.toFixed(2)})`, 10, 40);
  text(`|| mouse - car || = ${diff.mag().toFixed(2)}`, 10, 60);
  text(`angulo = ${diff.heading().toFixed(2)}`, 10, 80);
}

function drawArrow(base, vec, myColor, label) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);

  if (!base) {
    base = createVector(0, 0);
  }

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
