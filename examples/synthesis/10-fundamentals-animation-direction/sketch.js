var cx;
var cy;
var d = 50;
var r = d / 2;
var tocou = false;
var rectw, recth;
var direction = +1;
var speed = 5;

function setup() {
  createCanvas(400, 400);
  cx = width / 2;
  cy = height / 2;
  rectw = width - d;
  recth = height - d;
  frameRate(5)
}

function draw() {
  background(220);
  
  // desenha círculo
  fill(255);
  stroke(0);
  strokeWeight(1);
  circle(cx, cy, d);
  
  // desenha área de interesse
  noFill();
  stroke("gray");
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
  text(`Direção: ${direction > 0 ? '+' : ''}${direction} (${direction < 0 ? 'para cima' : 'para baixo'}) no eixo Y`, 30, 70)
  
  // calcula a próxima posição
  var nextcy = cy + speed * direction;

  // detecta e trata colisão
  if (nextcy + r > height || nextcy - r < 0) {
    direction = -direction;
    tocou = true;
  } else {
    cy = nextcy;
    tocou = false;
  }
}
