var grid = 50;
var v, u, w, dif, o;
var colorv, coloru, colorw;

function setup() {
  createCanvas(700, 500);
  v = createVector(5, 2);
  colorv = color("red");

  u = createVector(3, 4);
  coloru = color("green");

  w = p5.Vector.sub(v, u);
  colorw = color("blue");

  o = createVector(width / grid / 2, height / grid / 2);
}

function draw() {
  background(235);
  drawGrid(grid);
  drawArrow(o, v, colorv, 'v = (5, 2)');
  drawArrow(o, u, coloru, 'u = (3, 4)');
  drawArrow(o, w, colorw, 'w = v - u = (2, -2)');
  var nu = p5.Vector.add(o, u);
  drawArrow(nu, w, colorw, 'w (origem em u)');
  drawInfo();
}

function drawGrid(s) {
  strokeWeight(0.1);
  // linhas horizontais
  var qx = width / 2 / s;
  for (var x = 0, xi = -qx; x < width; x += s, xi++) {
    stroke(200);
    line(x, 0, x, height);
    strokeWeight(1);
    fill(100);
    text(xi, x + 2, o.y * grid + 13);
  }

  // linhas verticais
  var qy = height / 2 / s;
  for (var y = 0, yi = -qy; y < height; y += s, yi++) {
    stroke(200);
    line(0, y, width, y);
    strokeWeight(1);
    fill(100);
    text(yi, o.x * grid - 13, y - 3);
  }

  // eixo x
  stroke(50);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);

  // eixo y
  line(width / 2, 0, width / 2, height);
}

function drawInfo() {
  strokeWeight(1);
  stroke("black");
  fill(255);
  push();
  translate(20, height - 100);
  rect(0, 0, 120, 60);
  fill(0);
  text("v = (" + v.x + ", " + v.y + ")", 10, 15);
  text("u = (" + u.x + ", " + u.y + ")", 10, 30);
  text("w = v - u = (" + w.x + ", " + w.y + ")", 10, 45);
  pop();
}

// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor, label) {
  push();
  stroke(myColor);
  strokeWeight(0.05);
  fill(myColor);
  scale(grid);
  translate(base.x, base.y); //Will transport the object line (below) to the tip of the positional vector v1
  line(0, 0, vec.x, vec.y); //The line from the O to the tip of v1
  
  push();
  translate(vec.x/2,vec.y/2)
  textSize(0.3)
  strokeWeight(0.01);
  if (label) {
    text(label, 0.2, 0);
  }
  pop();

  rotate(vec.heading()); //Rotates the following triangle the angle of v1
  let arrowSize = 0.2; // Determines size of the vector arrowhead (triangle).
  translate(vec.mag() - arrowSize, 0); //Will translate a triangle below by the modulus of v1
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
