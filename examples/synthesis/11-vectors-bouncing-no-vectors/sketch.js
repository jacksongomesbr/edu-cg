let cx = 100;
let cy = 100;
let d = 48;
let r = d/2;
let vx = 4.0;
let vy = 1.0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);

  // calcula a nova posição
  cx += vx;
  cy += vy;

  // verifica colisão e atualiza velocidade
  if (cx + r > width || cx - r < 0) {
    vx = -vx;
  }
  if (cy + r > height || cy - r < 0) {
    vy = -vy;
  }

  // desenha a bola
  stroke(0);
  fill(127);
  circle(cx, cy, d);
}

