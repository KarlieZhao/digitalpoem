/*
Cloth mesh
Uses verlet integration to simulate a piece of cloth.
Inspired by Keith Peters (youtube.com/watch?v=3HjO_RGIjCU)
*/

// Global variables
const Q_VALUE = 81;
const W_VALUE = 87;
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
let poem = 
`Your abandoned clothes tell me every aspect of you. Your size,your taste, your favorite
\xa0\xa0\xa0\xa0\xa0colors. The saggy parts of
\xa0\xa0\xa0\xa0cloth show the shapes of your
\xa0body. The signs of wear and
\xa0\xa0\xa0tear tell about your habitual
\xa0actions. The types of fabric
\xa0\xa0and the bits of skin say every-thing about your skin, and evenyour genes. It’s never been
\xa0\xa0\xa0easier than today to keep a
\xa0\xa0\xa0person around, sculpting them
\xa0based on the clothes they left. \"Your absence has gone throughme, like thread through a
\xa0\xa0\xa0\xa0\xa0needle, everything I do is
\xa0\xa0\xa0\xa0stitched with its color.\"`

let rows = 20;
let cols = 31;
let isCut = false;

function preload() {
    monoFont = loadFont('RobotoMono-VariableFont_wght.ttf');
}

function addPoint(xPos, yPos) {
    let newPoint = new Point(xPos, yPos);
    points.push(newPoint);
    return newPoint;
}


function addSegment(point1, point2) {
    let newSegment = new Segment(point1, point2);
    segments.push(newSegment);
    return newSegment;
}


function setup() {
    createCanvas(window.innerWidth, window.innerHeight*0.95);
    textAlign(CENTER);
    background(255);
    resetGrid(doTriangulation);
    lastMousex = width / 2;
    lastMousey = height / 2;
    textFont(monoFont, 15);
}

// Create grid
function resetGrid(triangulation) {
    points = [];
    segments = [];

    let startX = width / 2.6;
    let startY = height / 5;
    let gridSize = 400;
    let cellSize = gridSize / gridResolution;
    let row_size = gridSize*1.2 / rows;
    let col_size = gridSize / cols;

    // for (let y = 0; y < gridResolution; y++) {
    //     for (let x = 0; x < gridResolution; x++) {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let newPoint = addPoint(startX + (x * col_size), startY + (y * row_size));

            if (y == 0) { // Snap points in first row
                // if (x < 5 || x >= gridResolution-7) {
                newPoint.snap = true;
                // }
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
    background(255);

    // Sim grid
    for (i in points) {
        points[i].sim();
    }

    for (timestep = 0; timestep < timesteps; timestep++) {
        for (i in segments) { segments[i].sim(); }
        for (i in points) { points[i].collideToWindow(); }
    }

    // Draw grid
    // for (i in segments) { segments[i].draw(); }
  
    for (let i = 0; i < points.length; i++) {
        let pt = points[i];
        pt.draw(i);
    }
    
    // Display tool tips
    textSize(16);
    text("Drag mouse to add wind.", width / 2, 25);
    text("Press SPACE to cut, press W/E to snap/unsnap hovered letters. ", width / 2, 50);
    // User wind force

    if (mouseIsPressed) {
    // let wind = createVector((mouseX - lastMousex) * 1.6 / width, (mouseY - lastMousey) * 1.7 / height, 0);
    let wind = createVector(0, 0, 0);
    if (mouseX - lastMousex < 0) {
        wind.x = -0.1;
    } else if (mouseX - lastMousex > 0) { wind.x = 0.1; }
    if (mouseY - lastMousey < 0) {
        wind.y = 0.1;
    }else if(mouseY - lastMousey > 0){
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

    if (pressedKey != SPACE && pressedKey != W_VALUE && pressedKey != E_VALUE) {
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
    if (pressedKey == W_VALUE || pressedKey == E_VALUE) {
        // Snap/unsnap closest point
        for (let i = 0; i < points.length; i++) {
            let pt = points[i];
            let pos = pt.pos;
            let dist = mousePos.dist(pos);
            if (dist < distToBeat) {
                distToBeat = dist;
                index = i;
            }
        }
        if (index > -1 && distToBeat < distThreshold) {
            if (pressedKey == W_VALUE) {
                points[index].snap = true;
            } else {
                points[index].snap = false;
            }
        }
    }
}