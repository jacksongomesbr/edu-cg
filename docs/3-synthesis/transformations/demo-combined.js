class House {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseWidth = 30;
        this.roofHeight = 15;
        this.doorWidth = 10;
        this.doorHeight = 15;
    }

    /**
     * Renders a house shape at the current (x, y) position.
     * The house consists of a triangle (roof), a rectangle (body), and a smaller rectangle (door).
     * Uses p5.js functions for drawing and transformation.
     */
    display() {
        push();
        translate(this.x, this.y);
        rotate(PI / 4);
        scale(1.5, 0.5);

        triangle(this.roofHeight, 0, 0, this.roofHeight, this.baseWidth, this.roofHeight);
        rect(0, this.roofHeight, this.baseWidth, this.baseWidth);
        rect(12, this.baseWidth, this.doorWidth, this.doorHeight);

        pop();
    }
}

houses = [];
const HOUSE_STEP = 70;

function setup() {
    createCanvas(600, 200);
    const houseY = height / 2 - 30;

    for (let i = 50; i < width; i += HOUSE_STEP) {
        houses.push(new House(i, houseY));
    }

}
function draw() {
    background(255);
    houses.forEach((house, index) => {
        house.display();
    });
}