// Demonstração de detecção de colisão usando vetores
// Este sketch mostra diferentes tipos de detecção de colisão com produto vetorial

let pointA, pointB, pointC, pointD, testPoint;
let draggingA = false, draggingB = false, draggingC = false, draggingD = false, draggingTest = false;
let currentMode = 'point-line'; // 'point-line', 'line-line', 'point-circle'
let circleCenter, circleRadius = 80;
let draggingCenter = false;

function setup() {
  createCanvas(900, 700);
  
  // Pontos iniciais
  pointA = createVector(200, 300);
  pointB = createVector(600, 400);
  pointC = createVector(150, 150);
  pointD = createVector(550, 200);
  testPoint = createVector(450, 250);
  circleCenter = createVector(400, 350);
  
  textAlign(CENTER, CENTER);
  textSize(16);
}

function draw() {
  background(245, 245, 250);
  
  // Atualiza pontos se estão sendo arrastados
  updateDragging();
  
  // Desenha baseado no modo atual
  switch(currentMode) {
    case 'point-line':
      drawPointLineMode();
      break;
    case 'line-line':
      drawLineLineMode();
      break;
    case 'point-circle':
      drawPointCircleMode();
      break;
  }
  
  // Interface
  drawUI();
  drawInstructions();
  drawMathInfo();
}

function drawPointLineMode() {
  // Linha de referência
  stroke(100);
  strokeWeight(3);
  line(pointA.x, pointA.y, pointB.x, pointB.y);
  
  // Calcula distância do ponto à linha usando produto vetorial
  let lineVector = p5.Vector.sub(pointB, pointA);
  let pointVector = p5.Vector.sub(testPoint, pointA);
  
  // Produto vetorial dá área do paralelogramo
  let crossProduct = p5.Vector.cross(lineVector, pointVector);
  let area = abs(crossProduct.z);
  
  // Distância = área / base
  let lineLength = lineVector.mag();
  let distance = area / lineLength;
  
  // Projeção do ponto na linha
  let projection = p5.Vector.dot(pointVector, lineVector) / (lineLength * lineLength);
  projection = constrain(projection, 0, 1);
  let closestPoint = p5.Vector.lerp(pointA, pointB, projection);
  
  // Verifica se há colisão (distância menor que threshold)
  let threshold = 30;
  let collision = distance < threshold;
  
  // Desenha linha estendida para mostrar zona de colisão
  drawThickLine(pointA, pointB, threshold, collision);
  
  // Desenha ponto mais próximo na linha
  fill(255, 150, 0);
  stroke(0);
  strokeWeight(2);
  ellipse(closestPoint.x, closestPoint.y, 12, 12);
  
  // Linha de distância
  stroke(collision ? color(255, 100, 100) : color(150));
  strokeWeight(2);
  if (collision) {
    // Linha tracejada para colisão
    drawDashedLine(testPoint.x, testPoint.y, closestPoint.x, closestPoint.y);
  } else {
    line(testPoint.x, testPoint.y, closestPoint.x, closestPoint.y);
  }
  
  // Desenha pontos
  drawPoints([pointA, pointB], ['A', 'B']);
  drawTestPoint(collision);
  
  // Informações da colisão
  displayPointLineInfo(distance, threshold, collision, area, lineLength);
}

function drawLineLineMode() {
  // Duas linhas
  stroke(100);
  strokeWeight(3);
  line(pointA.x, pointA.y, pointB.x, pointB.y);
  stroke(150);
  line(pointC.x, pointC.y, pointD.x, pointD.y);
  
  // Calcula intersecção usando produto vetorial
  let intersection = lineLineIntersection(pointA, pointB, pointC, pointD);
  let collision = intersection.intersects;
  
  // Desenha linhas com zona de colisão
  drawThickLine(pointA, pointB, 15, collision);
  drawThickLine(pointC, pointD, 15, collision);
  
  // Ponto de intersecção
  if (collision && intersection.point) {
    fill(collision ? color(255, 100, 100) : color(255, 150, 0));
    stroke(0);
    strokeWeight(2);
    ellipse(intersection.point.x, intersection.point.y, 15, 15);
    
    // Label do ponto de intersecção
    fill(0);
    noStroke();
    textSize(14);
    text("I", intersection.point.x + 20, intersection.point.y - 20);
  }
  
  // Desenha pontos
  drawPoints([pointA, pointB, pointC, pointD], ['A', 'B', 'C', 'D']);
  
  // Informações da colisão
  displayLineLineInfo(intersection, collision);
}

function drawPointCircleMode() {
  // Círculo
  let distance = p5.Vector.dist(testPoint, circleCenter);
  let collision = distance < circleRadius;
  
  // Desenha círculo
  fill(collision ? color(255, 100, 100, 100) : color(200, 200, 255, 100));
  stroke(collision ? color(255, 100, 100) : color(100));
  strokeWeight(3);
  ellipse(circleCenter.x, circleCenter.y, circleRadius * 2, circleRadius * 2);
  
  // Centro do círculo
  fill(100);
  stroke(0);
  strokeWeight(2);
  ellipse(circleCenter.x, circleCenter.y, 12, 12);
  
  // Linha de distância
  stroke(collision ? color(255, 100, 100) : color(150));
  strokeWeight(2);
  line(testPoint.x, testPoint.y, circleCenter.x, circleCenter.y);
  
  // Ponto na borda do círculo mais próximo
  let direction = p5.Vector.sub(testPoint, circleCenter);
  direction.normalize();
  direction.mult(circleRadius);
  let borderPoint = p5.Vector.add(circleCenter, direction);
  
  fill(255, 150, 0);
  stroke(0);
  strokeWeight(2);
  ellipse(borderPoint.x, borderPoint.y, 10, 10);
  
  // Labels
  fill(0);
  noStroke();
  textSize(14);
  text("C", circleCenter.x + 15, circleCenter.y - 15);
  
  // Desenha ponto teste
  drawTestPoint(collision);
  
  // Informações da colisão
  displayPointCircleInfo(distance, circleRadius, collision);
}

function drawThickLine(start, end, thickness, collision) {
  // Cria uma linha "gorda" usando um retângulo
  let direction = p5.Vector.sub(end, start);
  let perp = createVector(-direction.y, direction.x);
  perp.normalize();
  perp.mult(thickness);
  
  fill(collision ? color(255, 100, 100, 100) : color(200, 200, 255, 50));
  stroke(collision ? color(255, 100, 100) : color(100));
  strokeWeight(1);
  
  beginShape();
  vertex(start.x + perp.x, start.y + perp.y);
  vertex(start.x - perp.x, start.y - perp.y);
  vertex(end.x - perp.x, end.y - perp.y);
  vertex(end.x + perp.x, end.y + perp.y);
  endShape(CLOSE);
  
  // Linha central
  stroke(100);
  strokeWeight(3);
  line(start.x, start.y, end.x, end.y);
}

function drawDashedLine(x1, y1, x2, y2) {
  let distance = dist(x1, y1, x2, y2);
  let dashLength = 8;
  let direction = createVector(x2 - x1, y2 - y1);
  direction.normalize();
  direction.mult(dashLength);
  
  for (let i = 0; i < distance; i += dashLength * 2) {
    let start = createVector(x1, y1);
    start.add(p5.Vector.mult(direction, i));
    let end = p5.Vector.add(start, direction);
    
    if (p5.Vector.dist(start, createVector(x1, y1)) < distance) {
      line(start.x, start.y, 
           min(end.x, x2), min(end.y, y2));
    }
  }
}

function drawPoints(points, labels) {
  for (let i = 0; i < points.length; i++) {
    fill(100);
    stroke(0);
    strokeWeight(2);
    ellipse(points[i].x, points[i].y, 15, 15);
    
    fill(0);
    noStroke();
    textSize(14);
    text(labels[i], points[i].x + 20, points[i].y - 20);
  }
}

function drawTestPoint(collision) {
  fill(collision ? color(255, 100, 100) : color(50, 200, 50));
  stroke(0);
  strokeWeight(2);
  ellipse(testPoint.x, testPoint.y, 20, 20);
  
  fill(0);
  noStroke();
  textSize(14);
  text("P", testPoint.x, testPoint.y - 25);
}

function lineLineIntersection(p1, p2, p3, p4) {
  // Usando produto vetorial para calcular intersecção de linhas
  let d1 = p5.Vector.sub(p2, p1);
  let d2 = p5.Vector.sub(p4, p3);
  let d3 = p5.Vector.sub(p1, p3);
  
  let cross1 = p5.Vector.cross(d1, d2).z;
  
  if (abs(cross1) < 0.0001) {
    // Linhas paralelas
    return { intersects: false, point: null, parallel: true };
  }
  
  let cross2 = p5.Vector.cross(d3, d2).z;
  let cross3 = p5.Vector.cross(d3, d1).z;
  
  let t = cross2 / cross1;
  let u = cross3 / cross1;
  
  // Verifica se a intersecção está dentro dos segmentos
  let intersects = (t >= 0 && t <= 1 && u >= 0 && u <= 1);
  
  let point = null;
  if (intersects) {
    point = p5.Vector.lerp(p1, p2, t);
  }
  
  return { intersects, point, t, u, parallel: false };
}

function displayPointLineInfo(distance, threshold, collision, area, lineLength) {
  fill(255, 255, 255, 220);
  stroke(100);
  rect(20, 20, 320, 140);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  
  text("Colisão Ponto-Linha:", 30, 40);
  text(`Distância: ${distance.toFixed(2)}`, 30, 60);
  text(`Threshold: ${threshold}`, 30, 80);
  
  fill(collision ? color(255, 100, 100) : color(50, 150, 50));
  text(collision ? "COLISÃO DETECTADA" : "Sem colisão", 30, 100);
  
  fill(0);
  textSize(12);
  text(`Área do paralelogramo: ${area.toFixed(1)}`, 30, 120);
  text(`Comprimento da linha: ${lineLength.toFixed(1)}`, 30, 135);
  text(`Distância = Área / Comprimento`, 30, 150);
}

function displayLineLineInfo(intersection, collision) {
  fill(255, 255, 255, 220);
  stroke(100);
  rect(20, 20, 320, 120);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  
  text("Colisão Linha-Linha:", 30, 40);
  
  if (intersection.parallel) {
    fill(150, 150, 150);
    text("Linhas paralelas", 30, 60);
  } else {
    text(`Parâmetro t: ${intersection.t?.toFixed(3)}`, 30, 60);
    text(`Parâmetro u: ${intersection.u?.toFixed(3)}`, 30, 80);
    
    fill(collision ? color(255, 100, 100) : color(50, 150, 50));
    text(collision ? "INTERSECÇÃO NOS SEGMENTOS" : "Intersecção fora dos segmentos", 30, 100);
  }
  
  fill(0);
  textSize(12);
  text("Usando produto vetorial para calcular", 30, 120);
  text("parâmetros t e u da intersecção", 30, 135);
}

function displayPointCircleInfo(distance, radius, collision) {
  fill(255, 255, 255, 220);
  stroke(100);
  rect(20, 20, 320, 100);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  
  text("Colisão Ponto-Círculo:", 30, 40);
  text(`Distância ao centro: ${distance.toFixed(2)}`, 30, 60);
  text(`Raio: ${radius}`, 30, 80);
  
  fill(collision ? color(255, 100, 100) : color(50, 150, 50));
  text(collision ? "PONTO DENTRO DO CÍRCULO" : "Ponto fora do círculo", 30, 100);
  
  fill(0);
  textSize(12);
  text(`Teste: distância < raio`, 30, 120);
}

function drawUI() {
  // Seletor de modo
  fill(255, 255, 255, 220);
  stroke(100);
  rect(width - 250, 20, 230, 100);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  
  text("Tipo de Colisão:", width - 240, 40);
  
  // Botões de modo
  let modes = [
    { key: 'point-line', label: 'Ponto-Linha' },
    { key: 'line-line', label: 'Linha-Linha' },
    { key: 'point-circle', label: 'Ponto-Círculo' }
  ];
  
  for (let i = 0; i < modes.length; i++) {
    let mode = modes[i];
    let isActive = currentMode === mode.key;
    
    fill(isActive ? color(100, 200, 100) : color(200));
    stroke(100);
    rect(width - 240, 60 + i * 25, 100, 20);
    
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(11);
    text(mode.label, width - 190, 70 + i * 25);
  }
  
  textAlign(CENTER, CENTER);
}

function drawInstructions() {
  fill(255, 255, 255, 220);
  stroke(100);
  rect(width - 250, 140, 230, 120);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  
  text("Instruções:", width - 240, 155);
  text("• Arraste os pontos", width - 240, 170);
  text("• Observe as zonas de colisão", width - 240, 185);
  text("• Pontos vermelhos = colisão", width - 240, 200);
  text("• Pontos verdes = sem colisão", width - 240, 215);
  text("• Clique nos botões para", width - 240, 230);
  text("  mudar o tipo de teste", width - 240, 245);
}

function drawMathInfo() {
  fill(255, 255, 255, 220);
  stroke(100);
  rect(width - 250, 280, 230, 140);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  
  text("Matemática:", width - 240, 295);
  
  if (currentMode === 'point-line') {
    text("• Produto vetorial AB × AP", width - 240, 310);
    text("• Área = |AB × AP|", width - 240, 325);
    text("• Distância = Área / |AB|", width - 240, 340);
    text("• Projeção para ponto mais próximo", width - 240, 355);
  } else if (currentMode === 'line-line') {
    text("• Sistemas de equações lineares", width - 240, 310);
    text("• Produto vetorial para paralelas", width - 240, 325);
    text("• Parâmetros t e u da intersecção", width - 240, 340);
    text("• Teste: 0 ≤ t,u ≤ 1", width - 240, 355);
  } else {
    text("• Distância euclidiana", width - 240, 310);
    text("• |P - C| < raio", width - 240, 325);
    text("• Simples mas eficaz", width - 240, 340);
  }
  
  text("Aplicações:", width - 240, 375);
  text("• Jogos (física, colisões)", width - 240, 390);
  text("• CAD/CAM", width - 240, 405);
}

function updateDragging() {
  if (draggingA) pointA.set(mouseX, mouseY);
  if (draggingB) pointB.set(mouseX, mouseY);
  if (draggingC) pointC.set(mouseX, mouseY);
  if (draggingD) pointD.set(mouseX, mouseY);
  if (draggingTest) testPoint.set(mouseX, mouseY);
  if (draggingCenter) circleCenter.set(mouseX, mouseY);
}

function mousePressed() {
  // Verifica clique nos botões de modo
  for (let i = 0; i < 3; i++) {
    if (mouseX > width - 240 && mouseX < width - 140 && 
        mouseY > 60 + i * 25 && mouseY < 80 + i * 25) {
      let modes = ['point-line', 'line-line', 'point-circle'];
      currentMode = modes[i];
      return;
    }
  }
  
  // Verifica clique nos pontos
  if (dist(mouseX, mouseY, pointA.x, pointA.y) < 20) {
    draggingA = true;
  } else if (dist(mouseX, mouseY, pointB.x, pointB.y) < 20) {
    draggingB = true;
  } else if (dist(mouseX, mouseY, pointC.x, pointC.y) < 20 && currentMode === 'line-line') {
    draggingC = true;
  } else if (dist(mouseX, mouseY, pointD.x, pointD.y) < 20 && currentMode === 'line-line') {
    draggingD = true;
  } else if (dist(mouseX, mouseY, testPoint.x, testPoint.y) < 20) {
    draggingTest = true;
  } else if (dist(mouseX, mouseY, circleCenter.x, circleCenter.y) < 20 && currentMode === 'point-circle') {
    draggingCenter = true;
  }
}

function mouseReleased() {
  draggingA = draggingB = draggingC = draggingD = draggingTest = draggingCenter = false;
}

function keyPressed() {
  if (key === '1') {
    currentMode = 'point-line';
  } else if (key === '2') {
    currentMode = 'line-line';
  } else if (key === '3') {
    currentMode = 'point-circle';
  } else if (key === 'r' || key === 'R') {
    // Reset pontos
    pointA.set(200, 300);
    pointB.set(600, 400);
    pointC.set(150, 150);
    pointD.set(550, 200);
    testPoint.set(450, 250);
    circleCenter.set(400, 350);
  }
}