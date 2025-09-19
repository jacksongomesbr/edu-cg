function setup() {
  createCanvas(400, 400);
}

function draw() {
  loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let bright = random(255);
      set(x, y, floor(bright));
    }
  }

  updatePixels();
  noLoop();
}