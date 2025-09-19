// Demonstração interativa do produto escalar
// Este sketch mostra visualmente como o produto escalar relaciona dois vetores

let vectorA, vectorB;
let origin;
let draggingA = false;
let draggingB = false;

function setup() {
  createCanvas(800, 600);

  // Origem dos vetores no centro da tela
  origin = createVector(width / 2, height / 2);

  // Vetores iniciais
  vectorA = createVector(150, -80); // Vermelho
  vectorB = createVector(100, 120); // Azul

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

  // Calcula produto escalar e ângulo
  let dotProduct = p5.Vector.dot(vectorA, vectorB);
  let angle = p5.Vector.angleBetween(vectorA, vectorB);
  let angleDegrees = degrees(angle);

  // Desenha os vetores
  drawVector(vectorA, color(220, 50, 50), "A");
  drawVector(vectorB, color(50, 50, 220), "B");

  // Desenha projeção de A em B
  drawProjection(vectorA, vectorB);

  // Desenha ângulo entre vetores
  drawAngle(vectorA, vectorB, angle);

  // Informações na tela
  displayInfo(dotProduct, angleDegrees);

  // Interpretação do produto escalar
  displayInterpretation(dotProduct);

  // Instruções
  displayInstructions();
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
  line(0, height / 2, width, height / 2); // Eixo X
  line(width / 2, 0, width / 2, height); // Eixo Y
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
    end.x,
    end.y,
    end.x - direction.x + perp.x,
    end.y - direction.y + perp.y,
    end.x - direction.x - perp.x,
    end.y - direction.y - perp.y
  );
}

function drawProjection(vecA, vecB) {
  // Projeção de A em B
  let bNormalized = p5.Vector.normalize(vecB);
  let projectionLength = p5.Vector.dot(vecA, bNormalized);
  let projectionVector = p5.Vector.mult(bNormalized, projectionLength);

  let projEnd = p5.Vector.add(origin, projectionVector);
  let vecAEnd = p5.Vector.add(origin, vecA);

  // Linha da projeção
  stroke(100, 200, 100);
  strokeWeight(4);
  line(origin.x, origin.y, projEnd.x, projEnd.y);

  // Linha pontilhada da extremidade de A até a projeção
  stroke(100, 200, 100, 150);
  strokeWeight(2);
  drawDashedLine(vecAEnd.x, vecAEnd.y, projEnd.x, projEnd.y);

  // Label da projeção
  fill(100, 150, 100);
  noStroke();
  textSize(14);
  text("proj", projEnd.x, projEnd.y + 20);
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
      line(start.x, start.y, min(end.x, x2), min(end.y, y2));
    }
  }
}

function drawAngle(vecA, vecB, angle) {
  let radius = 40;
  let startAngle = atan2(vecA.y, vecA.x);
  let endAngle = atan2(vecB.y, vecB.x);

  // Garantir que o arco vai no sentido menor
  if (abs(endAngle - startAngle) > PI) {
    if (endAngle > startAngle) {
      startAngle += TWO_PI;
    } else {
      endAngle += TWO_PI;
    }
  }

  stroke(100);
  strokeWeight(2);
  noFill();
  arc(
    origin.x,
    origin.y,
    radius * 2,
    radius * 2,
    min(startAngle, endAngle),
    max(startAngle, endAngle)
  );

  // Label do ângulo
  let midAngle = (startAngle + endAngle) / 2;
  let labelPos = createVector(cos(midAngle), sin(midAngle));
  labelPos.mult(radius + 20);
  labelPos.add(origin);

  fill(100);
  noStroke();
  textSize(14);
  text("θ", labelPos.x, labelPos.y);
}

function displayInfo(dotProduct, angleDegrees) {
  // Painel de informações
  fill(255, 255, 255, 200);
  stroke(100);
  rect(20, 20, 250, 110);

  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);

  text("Produto Escalar: " + dotProduct.toFixed(2), 30, 30);
  text("Ângulo: " + angleDegrees.toFixed(1) + "°", 30, 50);
  text("||A||: " + vectorA.mag().toFixed(1), 30, 70);
  text("||B||: " + vectorB.mag().toFixed(1), 30, 90);

  // Fórmula
  textSize(12);
  text("A·B = ||A|| ||B|| cos(θ)", 30, 110);
}

function displayInterpretation(dotProduct) {
  // Interpretação do produto escalar
  fill(255, 255, 255, 200);
  stroke(100);
  rect(20, 160, 280, 70);

  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);

  text("Interpretação:", 30, 170);

  if (dotProduct > 0) {
    fill(0, 120, 0);
    text("Vetores apontam na mesma direção geral", 30, 190);
  } else if (dotProduct < 0) {
    fill(150, 0, 0);
    text("Vetores apontam em direções opostas", 30, 190);
  } else {
    fill(0, 0, 150);
    text("Vetores são perpendiculares!", 30, 190);
  }

  fill(0);
  textSize(12);
  text(
    "(ângulo " + (dotProduct > 0 ? "<" : dotProduct < 0 ? ">" : "=") + " 90°)",
    30,
    210
  );
}

function displayInstructions() {
  fill(255, 255, 255, 200);
  stroke(100);
  rect(20, height-77, 200, 70);

  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);

  text("Instruções:", 30, height-80+10);
  text("• Arraste as pontas dos vetores", 30, height-80+25);
  text("• Observe como o produto", 30, height-80+40);
  text("  escalar muda com o ângulo", 30, height-80+52);
}

function updateVectorDragging() {
  let endA = p5.Vector.add(origin, vectorA);
  let endB = p5.Vector.add(origin, vectorB);

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

// Função para resetar para uma configuração interessante
function keyPressed() {
  if (key === "r" || key === "R") {
    vectorA = createVector(150, -80);
    vectorB = createVector(100, 120);
  }

  // Configurações pré-definidas
  if (key === "1") {
    vectorA = createVector(100, 0); // Horizontal
    vectorB = createVector(0, 100); // Vertical (perpendicular)
  }

  if (key === "2") {
    vectorA = createVector(120, 80); // Mesma direção geral
    vectorB = createVector(90, 60);
  }

  if (key === "3") {
    vectorA = createVector(100, 50); // Direções opostas
    vectorB = createVector(-80, -40);
  }
}
