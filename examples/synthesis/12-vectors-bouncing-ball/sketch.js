let position; // posição
let d, r; // diâmetro e raio
let speed; // velocidade

function setup() {
  createCanvas(400, 400);
  position = createVector(width / 2, height / 2);
  d = 40;
  r = d / 2;
  speed = createVector(2.0, 5.0);
}

function draw() {
  background(220);

  // define posição futura (prévia)
  let x = position.x + speed.x;
  let y = position.y + speed.y;

  // checa colisão e altera velocidade, se for o caso
  if (x + r > width || x - r < 0) {
    speed.x = -speed.x;
  }
  if (y + r > height || y - r < 0) {
    speed.y = -speed.y;
  }

  // atualiza posição
  position.x = x;
  position.y = y;

  // Desenha a bola
  drawBall(position.x, position.y, d);

  // Desenha a seta de direção
  drawArrow(position.x, position.y, speed.x, speed.y);
  
  // Desenha o HUD
  drawHUD();
}

function drawBall(x, y, d) {
  fill(255);
  stroke(0);
  circle(x, y, d);  
}

function drawArrow(x, y, vx, vy) {
  // Normaliza o vetor de velocidade e escala para um tamanho visível
  let arrowLength = 40;
  let magnitude = sqrt(vx * vx + vy * vy);
  let normalizedVx = (vx / magnitude) * arrowLength;
  let normalizedVy = (vy / magnitude) * arrowLength;

  // Ponto final da seta
  let endX = x + normalizedVx;
  let endY = y + normalizedVy;

  // Desenha a linha principal da seta
  stroke(255, 0, 0); // Vermelho
  strokeWeight(3);
  line(x, y, endX, endY);

  // Calcula os pontos da ponta da seta
  let arrowHeadLength = 8;
  let angle = atan2(normalizedVy, normalizedVx);

  // Pontos da ponta da seta
  let x1 = endX - arrowHeadLength * cos(angle - PI / 6);
  let y1 = endY - arrowHeadLength * sin(angle - PI / 6);
  let x2 = endX - arrowHeadLength * cos(angle + PI / 6);
  let y2 = endY - arrowHeadLength * sin(angle + PI / 6);

  // Desenha a ponta da seta
  line(endX, endY, x1, y1);
  line(endX, endY, x2, y2);

  // Reseta as configurações de desenho
  strokeWeight(1);
  stroke(0);
}

function drawHUD() {
  fill(0);
  text(`Position = [${position.x}, ${position.y}]`, 10, 20);
  text(`Speed = [${speed.x}, ${speed.y}]`, 10, 40);
}
