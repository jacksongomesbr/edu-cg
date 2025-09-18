// Demonstração de detecção de orientação usando vetores
// Este sketch mostra como usar o produto vetorial para determinar orientação

let pointA, pointB, testPoint;
let draggingA = false;
let draggingB = false;
let draggingTest = false;
let showPolygon = false;
let polygonPoints = [];
let currentMode = 'line'; // 'line' ou 'polygon'

function setup() {
  createCanvas(900, 700);
  
  // Pontos iniciais para linha
  pointA = createVector(200, 300);
  pointB = createVector(600, 400);
  testPoint = createVector(450, 250);
  
  // Polígono de exemplo
  polygonPoints = [
    createVector(300, 150),
    createVector(500, 200),
    createVector(550, 350),
    createVector(400, 450),
    createVector(250, 400),
    createVector(200, 250)
  ];
  
  textAlign(CENTER, CENTER);
  textSize(16);
}

function draw() {
  background(245, 245, 250);
  
  // Atualiza pontos se estão sendo arrastados
  updateDragging();
  
  if (currentMode === 'line') {
    drawLineMode();
  } else {
    drawPolygonMode();
  }
  
  // Interface
  drawUI();
  drawInstructions();
}

function drawLineMode() {
  // Linha de referência
  stroke(100);
  strokeWeight(3);
  line(pointA.x, pointA.y, pointB.x, pointB.y);
  
  // Vetor da linha
  let lineVector = p5.Vector.sub(pointB, pointA);
  
  // Vetor do ponto A ao ponto teste
  let testVector = p5.Vector.sub(testPoint, pointA);
  
  // Produto vetorial para determinar orientação
  let crossProduct = p5.Vector.cross(lineVector, testVector);
  let orientation = crossProduct.z;
  
  // Desenha a linha com direção
  drawDirectedLine(pointA, pointB);
  
  // Desenha ponto teste com cor baseada na orientação
  let testColor;
  let orientationText;
  
  if (orientation > 0) {
    testColor = color(50, 200, 50); // Verde - esquerda
    orientationText = "ESQUERDA";
  } else if (orientation < 0) {
    testColor = color(200, 50, 50); // Vermelho - direita
    orientationText = "DIREITA";
  } else {
    testColor = color(150, 150, 150); // Cinza - colinear
    orientationText = "COLINEAR";
  }
  
  // Desenha ponto teste
  fill(testColor);
  stroke(0);
  strokeWeight(2);
  ellipse(testPoint.x, testPoint.y, 20, 20);
  
  // Label do ponto teste
  fill(0);
  noStroke();
  textSize(14);
  text("P", testPoint.x, testPoint.y - 25);
  
  // Desenha pontos A e B
  fill(100);
  stroke(0);
  strokeWeight(2);
  ellipse(pointA.x, pointA.y, 15, 15);
  ellipse(pointB.x, pointB.y, 15, 15);
  
  // Labels
  fill(0);
  noStroke();
  text("A", pointA.x - 20, pointA.y);
  text("B", pointB.x + 20, pointB.y);
  
  // Desenha vetores
  drawVector(pointA, lineVector, color(0, 0, 200), "AB", 0.7);
  drawVector(pointA, testVector, color(200, 100, 0), "AP", 0.7);
  
  // Informações de orientação
  displayOrientationInfo(orientation, orientationText);
  
  // Aplicação prática: área de um triângulo
  let triangleArea = abs(orientation) / 2;
  displayTriangleInfo(triangleArea);
}

function drawPolygonMode() {
  // Desenha polígono
  fill(200, 200, 255, 100);
  stroke(100);
  strokeWeight(2);
  
  beginShape();
  for (let point of polygonPoints) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
  
  // Desenha vértices do polígono
  for (let i = 0; i < polygonPoints.length; i++) {
    fill(100);
    stroke(0);
    strokeWeight(1);
    ellipse(polygonPoints[i].x, polygonPoints[i].y, 10, 10);
    
    fill(0);
    noStroke();
    textSize(12);
    text(i, polygonPoints[i].x + 15, polygonPoints[i].y);
  }
  
  // Testa se ponto está dentro do polígono
  let isInside = pointInPolygon(testPoint, polygonPoints);
  
  // Desenha ponto teste
  fill(isInside ? color(50, 200, 50) : color(200, 50, 50));
  stroke(0);
  strokeWeight(2);
  ellipse(testPoint.x, testPoint.y, 20, 20);
  
  // Label do ponto
  fill(0);
  noStroke();
  textSize(14);
  text("P", testPoint.x, testPoint.y - 25);
  
  // Visualiza raio para algoritmo
  if (mouseX > testPoint.x) {
    stroke(150, 150, 150);
    strokeWeight(1);
    line(testPoint.x, testPoint.y, width, testPoint.y);
    
    // Marca intersecções
    let intersections = getRayIntersections(testPoint, polygonPoints);
    for (let intersection of intersections) {
      fill(255, 100, 100);
      noStroke();
      ellipse(intersection.x, intersection.y, 8, 8);
    }
  }
  
  // Informações sobre o teste
  displayPolygonInfo(isInside);
}

function drawDirectedLine(start, end) {
  // Linha principal
  stroke(100);
  strokeWeight(3);
  line(start.x, start.y, end.x, end.y);
  
  // Seta indicando direção
  let direction = p5.Vector.sub(end, start);
  direction.normalize();
  direction.mult(20);
  
  let arrowTip = p5.Vector.add(end, direction.mult(-1));
  let perp = createVector(-direction.y, direction.x);
  perp.mult(0.5);
  
  fill(100);
  noStroke();
  triangle(
    end.x, end.y,
    arrowTip.x + perp.x * 8, arrowTip.y + perp.y * 8,
    arrowTip.x - perp.x * 8, arrowTip.y - perp.y * 8
  );
}

function drawVector(start, vec, col, label, scale = 1) {
  let scaledVec = p5.Vector.mult(vec, scale);
  let end = p5.Vector.add(start, scaledVec);
  
  stroke(col);
  strokeWeight(2);
  line(start.x, start.y, end.x, end.y);
  
  // Seta
  let direction = p5.Vector.normalize(scaledVec);
  direction.mult(10);
  let arrowBase = p5.Vector.sub(end, direction);
  let perp = createVector(-direction.y, direction.x);
  perp.mult(0.4);
  
  fill(col);
  noStroke();
  triangle(
    end.x, end.y,
    arrowBase.x + perp.x * 6, arrowBase.y + perp.y * 6,
    arrowBase.x - perp.x * 6, arrowBase.y - perp.y * 6
  );
  
  // Label
  fill(col);
  textSize(12);
  text(label, end.x + 10, end.y - 10);
}

function pointInPolygon(point, polygon) {
  let intersections = getRayIntersections(point, polygon);
  return intersections.length % 2 === 1;
}

function getRayIntersections(point, polygon) {
  let intersections = [];
  
  for (let i = 0; i < polygon.length; i++) {
    let current = polygon[i];
    let next = polygon[(i + 1) % polygon.length];
    
    // Verifica se o raio horizontal intersecta com esta aresta
    if ((current.y > point.y) !== (next.y > point.y)) {
      let intersectionX = current.x + (point.y - current.y) * (next.x - current.x) / (next.y - current.y);
      if (intersectionX > point.x) {
        intersections.push(createVector(intersectionX, point.y));
      }
    }
  }
  
  return intersections;
}

function displayOrientationInfo(orientation, orientationText) {
  // Painel de informações
  fill(255, 255, 255, 220);
  stroke(100);
  rect(20, 20, 300, 120);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  
  text("Detecção de Orientação:", 30, 40);
  text(`Produto Vetorial: ${orientation.toFixed(2)}`, 30, 60);
  
  // Cor baseada na orientação
  if (orientation > 0) {
    fill(50, 150, 50);
  } else if (orientation < 0) {
    fill(150, 50, 50);
  } else {
    fill(100);
  }
  
  textSize(16);
  text(`Ponto está à ${orientationText}`, 30, 80);
  
  fill(0);
  textSize(12);
  text("da linha orientada A → B", 30, 100);
  text("AB × AP = " + orientation.toFixed(2), 30, 120);
}

function displayTriangleInfo(area) {
  fill(255, 255, 255, 220);
  stroke(100);
  rect(20, 160, 300, 80);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  
  text("Área do Triângulo ABP:", 30, 180);
  text(`Área = |AB × AP| / 2 = ${area.toFixed(1)}`, 30, 200);
  
  textSize(12);
  text("O produto vetorial calcula", 30, 220);
  text("2× a área do triângulo", 30, 235);
}

function displayPolygonInfo(isInside) {
  fill(255, 255, 255, 220);
  stroke(100);
  rect(20, 20, 300, 100);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  
  text("Ponto no Polígono:", 30, 40);
  
  if (isInside) {
    fill(50, 150, 50);
    text("DENTRO do polígono", 30, 60);
  } else {
    fill(150, 50, 50);
    text("FORA do polígono", 30, 60);
  }
  
  fill(0);
  textSize(12);
  text("Algoritmo: Ray Casting", 30, 80);
  text("Conte intersecções do raio horizontal", 30, 95);
  text("Ímpar = dentro, Par = fora", 30, 110);
}

function drawUI() {
  // Seletor de modo
  fill(255, 255, 255, 220);
  stroke(100);
  rect(width - 220, 20, 200, 80);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  
  text("Modo:", width - 210, 40);
  
  // Botões de modo
  let lineColor = currentMode === 'line' ? color(100, 200, 100) : color(200);
  let polygonColor = currentMode === 'polygon' ? color(100, 200, 100) : color(200);
  
  fill(lineColor);
  stroke(100);
  rect(width - 210, 60, 80, 25);
  
  fill(polygonColor);
  rect(width - 120, 60, 80, 25);
  
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text("Linha", width - 170, 72);
  text("Polígono", width - 80, 72);
  
  textAlign(CENTER, CENTER);
}

function drawInstructions() {
  fill(255, 255, 255, 220);
  stroke(100);
  rect(width - 220, 120, 200, 140);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  
  text("Instruções:", width - 210, 135);
  
  if (currentMode === 'line') {
    text("• Arraste os pontos A, B, P", width - 210, 150);
    text("• Ponto verde: à ESQUERDA", width - 210, 165);
    text("• Ponto vermelho: à DIREITA", width - 210, 180);
    text("• Ponto cinza: COLINEAR", width - 210, 195);
    text("• Observe como o produto", width - 210, 210);
    text("  vetorial muda de sinal", width - 210, 225);
  } else {
    text("• Arraste o ponto P", width - 210, 150);
    text("• Verde: DENTRO do polígono", width - 210, 165);
    text("• Vermelho: FORA do polígono", width - 210, 180);
    text("• Pontos vermelhos: intersecções", width - 210, 195);
    text("• Move mouse para ver raio", width - 210, 210);
  }
  
  text("• Clique nos botões para", width - 210, 235);
  text("  alternar entre modos", width - 210, 250);
}

function drawApplications() {
  fill(255, 255, 255, 220);
  stroke(100);
  rect(width - 220, 280, 200, 120);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  
  text("Aplicações:", width - 210, 295);
  text("• Detecção de colisão", width - 210, 310);
  text("• Algoritmos de ordenação", width - 210, 325);
  text("  geométrica", width - 210, 340);
  text("• Convex hull", width - 210, 355);
  text("• Triangulação", width - 210, 370);
  text("• Pathfinding", width - 210, 385);
}

function updateDragging() {
  if (draggingA && currentMode === 'line') {
    pointA.set(mouseX, mouseY);
  }
  
  if (draggingB && currentMode === 'line') {
    pointB.set(mouseX, mouseY);
  }
  
  if (draggingTest) {
    testPoint.set(mouseX, mouseY);
  }
}

function mousePressed() {
  // Verifica clique nos botões de modo
  if (mouseX > width - 210 && mouseX < width - 130 && mouseY > 60 && mouseY < 85) {
    currentMode = 'line';
    return;
  }
  
  if (mouseX > width - 120 && mouseX < width - 40 && mouseY > 60 && mouseY < 85) {
    currentMode = 'polygon';
    return;
  }
  
  // Verifica clique nos pontos
  if (currentMode === 'line') {
    if (dist(mouseX, mouseY, pointA.x, pointA.y) < 20) {
      draggingA = true;
    } else if (dist(mouseX, mouseY, pointB.x, pointB.y) < 20) {
      draggingB = true;
    }
  }
  
  if (dist(mouseX, mouseY, testPoint.x, testPoint.y) < 20) {
    draggingTest = true;
  }
}

function mouseReleased() {
  draggingA = false;
  draggingB = false;
  draggingTest = false;
}

function keyPressed() {
  if (key === '1') {
    currentMode = 'line';
  } else if (key === '2') {
    currentMode = 'polygon';
  } else if (key === 'r' || key === 'R') {
    // Reset pontos
    pointA.set(200, 300);
    pointB.set(600, 400);
    testPoint.set(450, 250);
  }
}

// Atualiza função draw para incluir aplicações
function draw() {
  background(245, 245, 250);
  
  // Atualiza pontos se estão sendo arrastados
  updateDragging();
  
  if (currentMode === 'line') {
    drawLineMode();
  } else {
    drawPolygonMode();
  }
  
  // Interface
  drawUI();
  drawInstructions();
  drawApplications();
}