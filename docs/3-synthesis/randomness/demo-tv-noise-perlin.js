var inc = 0.01;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  loadPixels();

  var xoff = 0.0;
  for (let x = 0; x < width; x++) {
    var yoff = 0.0;
    for (let y = 0; y < height; y++) {
      let bright = map(noise(xoff, yoff), 0, 1, 0, 255);
      set(x, y, bright);
      yoff += inc;
    }
    xoff += inc;
  }

  updatePixels();
}
