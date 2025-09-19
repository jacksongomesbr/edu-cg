// Demonstração simples de vetores
let vectorA, vectorB, vectorSum;

function setup() {
  createCanvas(400, 300);
  
  // Criar vetores
  vectorA = createVector(100, 50);
  vectorB = createVector(80, 120);
}

function draw() {
  background(240);
  
  // Origem no centro da tela
  translate(width/2, height/2);
  
  // Atualizar vetores com movimento do mouse
  let mouseVector = createVector(mouseX - width/2, mouseY - height/2);
  vectorB = createVector(mouseVector.x * 0.3, mouseVector.y * 0.3);
  vectorSum = createVector(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
  
  // Desenhar grid
  drawGrid();
  
  // Desenhar vetores
  drawVector(vectorA, color(255, 0, 0), 'A');
  drawVector(vectorB, color(0, 0, 255), 'B', vectorA);
  drawVector(vectorSum, color(0, 150, 0), 'A+B');
}

function drawGrid() {
  stroke(200);
  strokeWeight(1);
  
  // Linhas verticais
  for (let x = -width/2; x <= width/2; x += 20) {
    line(x, -height/2, x, height/2);
  }
  
  // Linhas horizontais
  for (let y = -height/2; y <= height/2; y += 20) {
    line(-width/2, y, width/2, y);
  }
  
  // Eixos principais
  stroke(100);
  strokeWeight(2);
  line(-width/2, 0, width/2, 0); // Eixo X
  line(0, -height/2, 0, height/2); // Eixo Y
}

function drawVector(vec, col, label, origin = createVector(0, 0)) {
  push();
  translate(origin.x, origin.y);
  
  stroke(col);
  strokeWeight(3);
  
  // Linha do vetor
  line(0, 0, vec.x, vec.y);
  
  // Seta
  push();
  translate(vec.x, vec.y);
  rotate(atan2(vec.y, vec.x));
  
  fill(col);
  noStroke();
  triangle(0, 0, -10, -3, -10, 3);
  pop();
  
  // Label
  fill(col);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  text(label, vec.x + 15, vec.y - 5);
  
  pop();
}