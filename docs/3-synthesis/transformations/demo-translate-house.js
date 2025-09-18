/**
 * Represents a simple house shape for rendering with p5.js.
 * The house consists of a triangle (roof), a rectangle (body), and a smaller rectangle (door).
 *
 * @class
 * @param {number} x - The x-coordinate of the house position.
 * @param {number} y - The y-coordinate of the house position.
 *
 * @property {number} x - The x-coordinate of the house.
 * @property {number} y - The y-coordinate of the house.
 * @property {number} baseWidth - The width of the house base.
 * @property {number} roofHeight - The height of the house roof.
 * @property {number} doorWidth - The width of the house door.
 * @property {number} doorHeight - The height of the house door.
 *
 * @method display Renders the house at its current position using p5.js drawing functions.
 */
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
        triangle(this.roofHeight, 0, 0, this.roofHeight, this.baseWidth, this.roofHeight);
        rect(0, this.roofHeight, this.baseWidth, this.baseWidth);
        rect(12, this.baseWidth, this.doorWidth, this.doorHeight);
        pop();
    }
}

/**
 * An array that stores house objects for graphical transformations and rendering.
 * @type {Array<Object>}
 */
let houses = [];


/**
 * The number of pixels to move the house in each translation step.
 * @constant
 * @type {number}
 */
const HOUSE_STEP = 70;

/**
 * Sets up the canvas and initializes house objects at regular intervals along the x-axis.
 * Each house is positioned horizontally with a fixed vertical offset.
 * 
 * @function
 * @global
 */
function setup() {
    createCanvas(600, 200);
    const houseY = height / 2 - 30;

    for (let i = 50; i < width; i += HOUSE_STEP) {
        houses.push(new House(i, houseY));
    }

}

/**
 * Renders the scene by setting the background color and displaying all houses.
 * Iterates over the `houses` array and calls the `display` method for each house object.
 */
function draw() {
    background(255);

    houses.forEach((house, index) => {
        house.display();
    });
}
