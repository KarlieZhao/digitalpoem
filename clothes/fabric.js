/*
Cloth mesh
Uses verlet integration to simulate a piece of cloth.
Inspired by Keith Peters (youtube.com/watch?v=3HjO_RGIjCU)
*/

// Global variables
const Q_VALUE = 81;
const P_VALUE = 80;
const E_VALUE = 69;
const SPACE = 32;

let lastMousex, lastMousey;

let TIMESTEPS_MAX = 50;
let TIMESTEPS_MIN = 1;

let pressedKey = -1;
let timesteps = 3;
let gridResolution = 31;
let doTriangulation = false;
let points = [];
let segments = [];
let poem = `...........Cloth(es)...........Your abandoned clothes tell me ....every aspect of you...........Your size......your taste.........your favorite colors........The saggy parts of cloth....show the shapes of your body....The signs of wear and tear.......tell about your habits...........The fabric's texture......and bits of skin....speak to me.of how your touch would imbue...It’s never been easier.....................than today.......to keep a person around..........in these tangible remnants....I shape a semblance of you....From the clothes you left.........I trace the fleeting momentsthat were once left behind......My needle is now threaded with.........your absence..........all I do is to.........................prick and prod.........each stitch another empty mark.`
let rows = 25;
let cols = 31;
let isCut = false;

function addPoint(letter_index, xPos, yPos) {
    let newPoint = new Point(letter_index, xPos, yPos);
    points.push(newPoint);
    return newPoint;
}


function addSegment(point1, point2) {
    let newSegment = new Segment(point1, point2);
    segments.push(newSegment);
    return newSegment;
}


function setup() {
    createCanvas(window.innerWidth, window.innerHeight * 0.95);
    textAlign(CENTER)
    background(230);
    resetGrid(doTriangulation);
    lastMousex = width / 2;
    lastMousey = height / 2;

}

function mouseWheel() {
    let distToBeat = 99999.0;
    let distThreshold = 15.0;
    let index = -1;
    let mousePos = createVector(mouseX, mouseY, 0);

    for (let i = 0; i < segments.length; i++) {
        let segment = segments[i];
        let pos = createVector(segment.point1.pos.x, segment.point1.pos.y, segment.point1.pos.z);
        //interesting effect: 
        //  pos = segment.point1.pos;
        pos.add(segment.point2.pos);
        pos.div(2.0);
        let dist = mousePos.dist(pos);
        if (dist < distToBeat) {
            distToBeat = dist;
            index = i;
        }
    }
    if (index > -1 && distToBeat < distThreshold) {
        segments.splice(index, 1);
    }
}

// Create grid
function resetGrid(triangulation) {
    points = [];
    segments = [];

    let startX = width / 2.6;
    let startY = height / 6;
    let gridSize = 400;
    let row_size = gridSize * 1.4 / rows;
    let col_size = gridSize / cols;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let newPoint = addPoint(x + y * cols, startX + (x * col_size), startY + (y * row_size));

            if (y == 0) { // Snap points in first row
                newPoint.snap = true;
            } else { // Attach a segment on top
                addSegment(points[points.length - gridResolution - 1], newPoint);
                if (triangulation) {
                    if (!((x + 1) % gridResolution == 1)) { // Add a segment for triangulation
                        addSegment(points[points.length - gridResolution - 2], newPoint);
                    }
                }
            }

            if (!((x + 1) % gridResolution == 1)) { // Attach a segment to the left
                addSegment(points[points.length - 2], newPoint);
            }
        }
    }
}


function draw() {
    background(235);

    // Sim grid
    for (i in points) {
        points[i].sim();
    }

    for (timestep = 0; timestep < timesteps; timestep++) {
        for (i in segments) { segments[i].sim(); }
        for (i in points) { points[i].collideToWindow(); }
    }

    //unsnap
    if (!keyIsPressed) {
        let distToBeat = 99999.0;
        let distThreshold = 50.0;
        let index = -1;
        let mousePos = createVector(mouseX, mouseY, 0);
        for (let i = 0; i < points.length; i++) {
            let pt = points[i];
            let pos = pt.pos;
            let dist = mousePos.dist(pos);
            if (dist < distToBeat) {
                distToBeat = dist;
                index = i;
            }
        }
        if (index > -1 && distToBeat < distThreshold && points[index].snappable) {
            points[index].snap = false;
        }
    }

    //auto-unsnap
    if (frameCount >= 150) {
        for (let i = 0; i < 2; i++) {
            let s = floor(random(points.length));
            if (points[s].snappable) {
                points[s].snap = false;
            }
        }
    }

    // Draw grid
    // for (i in segments) { segments[i].draw(); }
    textSize(20);
    for (let i = 0; i < points.length; i++) {
        points[i].draw();
    }

    // Display tool tips
    textSize(14);
    fill(100)
    text("Drag mouse to add wind.", width / 2, 25);
    text("Press SPACE + move mouse to cut, press P to pin. ", width / 2, 50);

    // User wind force
    if (mouseIsPressed) {
        wind = createVector(0, 0, 0);
        if (mouseX - lastMousex < 0) {
            wind.x = -0.1;
        } else if (mouseX - lastMousex > 0) {
            wind.x = 0.1;
        }
        if (mouseY - lastMousey < 0) {
            wind.y = 0.1;
        } else if (mouseY - lastMousey > 0) {
            wind.y = -0.1;
        }
        for (pt in points) {
            points[pt].applyForce(wind);
        }
    }
    lastMousex = mouseX;
    lastMousey = mouseY;
}

function keyPressed() {
    pressedKey = keyCode;
}

function keyReleased() {
    pressedKey = -1; // Reset variable
}

function mouseMoved() {
    if (!keyPressed) {
        return;
    }

    if (pressedKey != SPACE && pressedKey != P_VALUE && pressedKey != E_VALUE) {
        return;
    }

    let distToBeat = 99999.0;
    let distThreshold = 15.0;
    let index = -1;
    let mousePos = createVector(mouseX, mouseY, 0);
    if (pressedKey === SPACE) {
        for (let i = 0; i < segments.length; i++) {
            let segment = segments[i];
            let pos = createVector(segment.point1.pos.x, segment.point1.pos.y, segment.point1.pos.z);
            //interesting effect: 
            //let pos = segment.point1.pos;
            pos.add(segment.point2.pos);
            pos.div(2.0);
            let dist = mousePos.dist(pos);
            if (dist < distToBeat) {
                distToBeat = dist;
                index = i;
            }
        }
        if (index > -1 && distToBeat < distThreshold) {
            segments.splice(index, 1);
        }
    }
    if (pressedKey == P_VALUE) {
        // Snap closest point
        for (let i = 0; i < points.length; i++) {
            let pt = points[i];
            let pos = pt.pos;
            let dist = mousePos.dist(pos);
            if (dist < distToBeat) {
                distToBeat = dist;
                index = i;
            }
        }
        if (index > -1 && distToBeat < distThreshold && points[index].snappable) {
            points[index].snap = true;
        }
    }
}