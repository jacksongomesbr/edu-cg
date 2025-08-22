let noiseLevel = 255;
let noiseScale = 0.01;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let nx = noiseScale * x;
      let ny = noiseScale * y;
      let nt = noiseScale * frameCount;

      let c = noiseLevel * noise(nx, ny, nt);

      set(x, y, color(c, c * 0.8, map(c, 0, 255, 100, 255)));
    }
  }
  updatePixels();
}