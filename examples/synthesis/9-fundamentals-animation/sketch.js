var cx;
var cy;
var d = 50;
var r = d / 2;
var tocou = false;
var rectw, recth;

function setup() {
  createCanvas(400, 400);
  cx = width / 2;
  cy = height / 2;
  rectw = width - d;
  recth = height - d;
}

function draw() {
  background(220);
  
  // desenha círculo
  fill(255);
  stroke(0);
  strokeWeight(1);
  circle(cx, cy, d);

  // verifica se o círculo tocou a borda
  if (cy + r < height - 1) {
    cy++;
    tocou = false;
  } else {
    tocou = true;
  }

  // desenha área de interesse
  noFill();
  if (!tocou) {
    stroke("green");
  } else {
    stroke("red");
  }
  rect(r, r, rectw, recth);
  
  // desenha ponto no centro do círculo
  stroke('red');
  strokeWeight(5);
  point(cx, cy);
  
  // desenha texto da HUD
  noStroke();
  fill(0);
  text(`Centro do círculo: (${cx}, ${cy})`, 30, 40);
  text(`Círculo tocou a borda? ${tocou}`, 30, 55);
}
