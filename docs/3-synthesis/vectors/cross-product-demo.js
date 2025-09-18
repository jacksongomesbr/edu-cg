// Demonstração interativa do produto vetorial em 2D
// Este sketch mostra o produto vetorial e suas aplicações práticas

let vectorA, vectorB;
let origin;
let draggingA = false;
let draggingB = false;
let showParallelogram = true;

function setup() {
  createCanvas(800, 600);
  
  // Origem dos vetores no centro da tela
  origin = createVector(width/2, height/2);
  
  // Vetores iniciais
  vectorA = createVector(150, -80);  // Vermelho
  vectorB = createVector(-100, 120); // Azul
  
  // Interface
  textAlign(CENTER, CENTER);
  textSize(16);
}

function draw() {
  background(240, 240, 250);
  
  // Grid de fundo
  drawGrid();
  
  // Atualiza vetores se estão sendo arrastados
  updateVectorDragging();
  
  // Calcula produto vetorial (componente Z do resultado 3D)
  let crossProduct = p5.Vector.cross(vectorA, vectorB);
  let crossZ = crossProduct.z; // Em 2D, só a componente Z é relevante
  let crossMagnitude = abs(crossZ);
  let area = crossMagnitude / 2; // Área do triângulo
  
  // Desenha os vetores
  drawVector(vectorA, color(220, 50, 50), "A");
  drawVector(vectorB, color(50, 50, 220), "B");
  
  // Desenha paralelogramo se ativado
  if (showParallelogram) {
    drawParallelogram(vectorA, vectorB);
  }
  
  // Desenha representação do produto vetorial
  drawCrossProductRepresentation(crossZ, crossMagnitude);
  
  // Informações na tela
  displayInfo(crossZ, crossMagnitude, area);
  
  // Interpretação do produto vetorial
  displayInterpretation(crossZ);
  
  // Instruções
  displayInstructions();
  
  // Aplicações
  displayApplications();
}

function drawGrid() {
  stroke(220);
  strokeWeight(1);
  
  // Linhas verticais
  for (let x = 0; x < width; x += 20) {
    line(x, 0, x, height);
  }
  
  // Linhas horizontais  
  for (let y = 0; y < height; y += 20) {
    line(0, y, width, y);
  }
  
  // Eixos principais
  stroke(180);
  strokeWeight(2);
  line(0, height/2, width, height/2); // Eixo X
  line(width/2, 0, width/2, height);  // Eixo Y
}

function drawVector(vec, col, label) {
  let endPoint = p5.Vector.add(origin, vec);
  
  // Linha do vetor
  stroke(col);
  strokeWeight(3);
  line(origin.x, origin.y, endPoint.x, endPoint.y);
  
  // Seta
  drawArrowhead(origin, endPoint, col);
  
  // Label
  fill(col);
  noStroke();
  textSize(20);
  text(label, endPoint.x + 15, endPoint.y - 15);
  
  // Ponto de controle (para arrastar)
  fill(col);
  ellipse(endPoint.x, endPoint.y, 12, 12);
}

function drawArrowhead(start, end, col) {
  let direction = p5.Vector.sub(end, start);
  direction.normalize();
  direction.mult(15);
  
  // Perpendicular para as "barbatanas" da seta
  let perp = createVector(-direction.y, direction.x);
  perp.mult(0.5);
  
  fill(col);
  noStroke();
  
  // Triângulo da seta
  triangle(
    end.x, end.y,
    end.x - direction.x + perp.x, end.y - direction.y + perp.y,
    end.x - direction.x - perp.x, end.y - direction.y - perp.y
  );
}

function drawParallelogram(vecA, vecB) {
  // Vértices do paralelogramo
  let pointA = p5.Vector.add(origin, vecA);
  let pointB = p5.Vector.add(origin, vecB);
  let pointC = p5.Vector.add(pointA, vecB);
  
  // Desenha o paralelogramo
  fill(255, 255, 0, 100);
  stroke(150, 150, 0);
  strokeWeight(2);
  
  beginShape();
  vertex(origin.x, origin.y);
  vertex(pointA.x, pointA.y);
  vertex(pointC.x, pointC.y);
  vertex(pointB.x, pointB.y);
  endShape(CLOSE);
  
  // Linhas auxiliares
  stroke(100);
  strokeWeight(1);
  line(pointA.x, pointA.y, pointC.x, pointC.y);
  line(pointB.x, pointB.y, pointC.x, pointC.y);
}

function drawCrossProductRepresentation(crossZ, magnitude) {
  // Desenha um círculo na origem para representar a direção do produto vetorial
  // Em 2D, o produto vetorial aponta para dentro ou fora da tela
  
  let radius = map(magnitude, 0, 200, 10, 40);
  radius = constrain(radius, 10, 40);
  
  if (crossZ > 0) {
    // Produto vetorial aponta para fora da tela (sentido anti-horário)
    fill(50, 200, 50, 150);
    stroke(50, 150, 50);
    strokeWeight(3);
    ellipse(origin.x, origin.y, radius * 2, radius * 2);
    
    // Símbolo de "ponto" (⊙) - para fora da tela
    fill(50, 150, 50);
    noStroke();
    ellipse(origin.x, origin.y, 8, 8);
    
    fill(0);
    textSize(12);
    text("⊙", origin.x, origin.y + 40);
    text("(para fora)", origin.x, origin.y + 55);
    
  } else if (crossZ < 0) {
    // Produto vetorial aponta para dentro da tela (sentido horário)
    fill(200, 50, 50, 150);
    stroke(150, 50, 50);
    strokeWeight(3);
    ellipse(origin.x, origin.y, radius * 2, radius * 2);
    
    // Símbolo de "cruz" (⊗) - para dentro da tela
    fill(150, 50, 50);
    noStroke();
    strokeWeight(3);
    line(origin.x - 4, origin.y - 4, origin.x + 4, origin.y + 4);
    line(origin.x - 4, origin.y + 4, origin.x + 4, origin.y - 4);
    
    fill(0);
    textSize(12);
    text("⊗", origin.x, origin.y + 40);
    text("(para dentro)", origin.x, origin.y + 55);
    
  } else {
    // Produto vetorial é zero (vetores paralelos)
    fill(100);
    noStroke();
    textSize(14);
    text("A × B = 0", origin.x, origin.y + 40);
    text("(paralelos)", origin.x, origin.y + 55);
  }
}

function displayInfo(crossZ, magnitude, area) {
  // Painel de informações
  fill(255, 255, 255, 200);
  stroke(100);
  rect(20, 20, 280, 140);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  
  text("Produto Vetorial A × B:", 30, 40);
  text(`Componente Z: ${crossZ.toFixed(2)}`, 30, 60);
  text(`Magnitude: ${magnitude.toFixed(2)}`, 30, 80);
  text(`Área do paralelogramo: ${magnitude.toFixed(2)}`, 30, 100);
  text(`Área do triângulo: ${area.toFixed(2)}`, 30, 120);
  
  // Componentes dos vetores
  textSize(12);
  text(`A = (${vectorA.x.toFixed(0)}, ${vectorA.y.toFixed(0)})`, 30, 140);
}

function displayInterpretation(crossZ) {
  // Interpretação do produto vetorial
  fill(255, 255, 255, 200);
  stroke(100);
  rect(20, 180, 280, 100);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  
  text("Interpretação:", 30, 200);
  
  if (crossZ > 0) {
    fill(0, 120, 0);
    text("Rotação anti-horária de A para B", 30, 220);
    text("Produto vetorial aponta para FORA", 30, 240);
  } else if (crossZ < 0) {
    fill(150, 0, 0);
    text("Rotação horária de A para B", 30, 220);
    text("Produto vetorial aponta para DENTRO", 30, 240);
  } else {
    fill(0, 0, 150);
    text("Vetores são paralelos!", 30, 220);
    text("Produto vetorial é zero", 30, 240);
  }
  
  fill(0);
  textSize(12);
  text("Em 2D: A×B = (0, 0, A.x*B.y - A.y*B.x)", 30, 260);
}

function displayInstructions() {
  fill(255, 255, 255, 200);
  stroke(100);
  rect(width - 220, 20, 200, 100);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  
  text("Instruções:", width - 210, 35);
  text("• Arraste as pontas dos vetores", width - 210, 50);
  text("• Observe a direção do produto", width - 210, 65);
  text("• P: mostrar/ocultar paralelogramo", width - 210, 80);
  text("• R: resetar vetores", width - 210, 95);
}

function displayApplications() {
  fill(255, 255, 255, 200);
  stroke(100);
  rect(width - 220, 140, 200, 120);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  
  text("Aplicações em 2D:", width - 210, 155);
  text("• Detectar orientação", width - 210, 170);
  text("• Verificar se ponto está à", width - 210, 185);
  text("  esquerda/direita de uma linha", width - 210, 200);
  text("• Calcular área de polígonos", width - 210, 215);
  text("• Algoritmos de convex hull", width - 210, 230);
  text("• Detecção de colisão", width - 210, 245);
}

function updateVectorDragging() {
  if (draggingA) {
    vectorA = createVector(mouseX - origin.x, mouseY - origin.y);
  }
  
  if (draggingB) {
    vectorB = createVector(mouseX - origin.x, mouseY - origin.y);
  }
}

function mousePressed() {
  let endA = p5.Vector.add(origin, vectorA);
  let endB = p5.Vector.add(origin, vectorB);
  
  // Verifica se clicou na ponta do vetor A
  if (dist(mouseX, mouseY, endA.x, endA.y) < 15) {
    draggingA = true;
  }
  // Verifica se clicou na ponta do vetor B
  else if (dist(mouseX, mouseY, endB.x, endB.y) < 15) {
    draggingB = true;
  }
}

function mouseReleased() {
  draggingA = false;
  draggingB = false;
}

// Controles por teclado
function keyPressed() {
  if (key === 'r' || key === 'R') {
    // Reset dos vetores
    vectorA = createVector(150, -80);
    vectorB = createVector(-100, 120);
  }
  
  if (key === 'p' || key === 'P') {
    showParallelogram = !showParallelogram;
  }
  
  // Configurações predefinidas
  if (key === '1') {
    vectorA = createVector(100, 0);   // Horizontal
    vectorB = createVector(0, 100);   // Vertical (produto vetorial máximo)
  }
  
  if (key === '2') {
    vectorA = createVector(120, 80);  // Rotação anti-horária
    vectorB = createVector(-60, 100);
  }
  
  if (key === '3') {
    vectorA = createVector(100, 50);  // Rotação horária
    vectorB = createVector(120, 60);
  }
  
  if (key === '4') {
    vectorA = createVector(100, 50);  // Vetores quase paralelos
    vectorB = createVector(105, 52.5);
  }
}

