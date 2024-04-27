// Global Variables
let loops = 4; // Ability to stretch
let ground = 900;
let friction = 0; // Bigger is less friction (negative is negative friction)
let bounce = 0.0;
let activeObjects = true; // Should objects appear (collides with points)
let grav = 0.000005;
// Rope mode variables
let startX = 650;
let textS = 16;
let amt = 363; // Amount of segments
let len = 10; // Length between segments
let controlPointIndex = amt - 1;
let txt = "Pinch me like a poem, pull me out of my context. Trace me like a stream, and I will wind you with words. Word is silence and sound, a string of knots. Thread forms a chain of notes and events, fullness and emptiness. And I am no longer tangled in the unions and separations of our plots. Read me like a knit, I have learned to purl with space, let knots be knots.";

// Arrays for points, sticks, and objects
let pointArray = [];
let stickArray = [];
let objectArray = [];
let shades = []; //new Array(amt);
let movingIncre = 1;
let noiseIndex = 0.7;

function setup() {
    createCanvas(window.innerWidth * 0.8, window.innerHeight*0.95);
    background(0);
    textSize(textS);

    for (let i = 0; i < amt; i++) {
        shades[i] = constrain(abs((i - amt / 2) * (2 * 255.0 / amt)), 80, 255);
    }

    for (let i = 0; i < amt; i++) {
        pointArray.push(new Point(10 + (i * len), 150));
        if (i > 0) {
            stickArray.push(new Stick(pointArray[i - 1], pointArray[i]));
        }
        if (i < 7) {
            pointArray[i].locked = true;
        }
    }
    if (activeObjects) {
        objectArray.push(new Obj(60, 560, 60));
        objectArray.push(new Obj(540, 730, 60));
        objectArray.push(new Obj(100, 900, 80));
        objectArray.push(new Obj(461, 284, 80));
        objectArray.push(new Obj(324, 670, 80));
        objectArray.push(new Obj(200, 462, 70));
        objectArray.push(new Obj(800, 700, 80));
    }
    pointArray[controlPointIndex].x = width/2;
    pointArray[controlPointIndex].y = height/2;
}

function draw() {
    background(255);

    // Update shading
    if (frameCount % 5 == 0) {
        let lastShade = shades[shades.length - 1];
        for (let i = shades.length - 1; i > 0; i--) {
            shades[i] = shades[i - 1];
        }
        shades[0] = lastShade;
    }

    pointArray[controlPointIndex].x = lerp(pointArray[controlPointIndex].x, mouseX, 0.1) + (noise(frameCount / 100) - noiseIndex) * movingIncre;
    pointArray[controlPointIndex].y = lerp(pointArray[controlPointIndex].y, mouseY, 0.1) + (noise(frameCount / 100 + 100) - noiseIndex) * movingIncre;
    updatePoints();

    for (let i = 0; i < loops; i++) {
        updateSticks();
    }
    collision();

    for (let i = 0; i < stickArray.length; i++) {
        fill(0, shades[i]);
        text(txt.charAt(i), stickArray[i].a.x, stickArray[i].a.y);

        // Debugging
        // strokeWeight(5);
        // let c = i % 2 == 0 ? 255 : 0;
        // stroke(c, c, 0);
        // line(stickArray[i].a.x, stickArray[i].a.y, stickArray[i].b.x, stickArray[i].b.y);
        // End debugging
    }
}