let lastMousex, lastMousey;

let TIMESTEPS_MAX = 50;
let TIMESTEPS_MIN = 1;
let timesteps = 3;
let gridResolution = 43;
let points = [];
let segments = [];
let poem =
   `...If..I..am..to..a..dictionary.as.I..........Am..to.my..bed.a..dictionary.is.oh.........So.big.so..sad.so..plenteous.If.we........Are.big.so..big.so..plenteous.as.we........Are.sad..I..can.not..retreat..to.us.........On..we..go!And..now...while..we.may..to....Our.bed.go,.our..own...full.bed.. united...Yet..so..I..can...not...sip.our..always...When..to..a..seed...we...are.our..sunset,..When..to..a..fall....we..are...a..chill....Now...on..we..walk,..no..rain..to........Rinse...us..We...feel..the..ice,.cup....of.Water...we..can..only..see,.not..sip....We.Lunge...to..our...own..two...old..examples,Tell...how..our....big..bad...sad...eases..Cant...we....say...eye..love...you.........With..out....the...spa..spac...space....... You..need....for....it,..only...words......Can..fill....the....end...weve...knitted,..Can..be......jugs...for...dusty...thoughts.Let..us......swim...now,..alone...together.Let..us.....hope.....we....float..tomorrow.We..can....drown.....on.....land...unknown.I...am....clear.....for......once...Daring.....We..stand.....above.......the.............Day..when......love........for.............Us...sat....sinking,........for............Us..too....crowded,.........for...........Now..so....distant............We...........Let..it...copulate,...........to...........Be..our...only................egg..........To..be...naive..As.......................lost..as...calmly,...............as........sure..as...softly,...............as........true..as....faults,..............as........fun..as.......false,.............as........dry..as.........nor,.............as........wry..as.........war,.............we........go...as.........low..............as........We...do.........not..............see.......On...we...go...Lost..............until..we......no..abundance...can.........withstand,.....We..transport...the.........daffodils,....And..drink......bitter......aquamarine,....We...are.....coffee-river-sitting-folk,..Worn...of...oysters....brokenheartedness...Spun...of...morning....superconductivity.Unfold..us...again.........and..contradict,Reach...us,.pull...................rougher,Yield...to..our.......old..............cry.Avoid...my..one......open..............eye.Allow...us..to.......psychoanalyze..........Back...to.bed,......anthropocentricity...`
let rows = 50;
let cols = 43;
let isCut = false;
let textS = 15;
let wind;

function addPoint(letter_index, xPos, yPos) {
    let newPoint = new Point(letter_index, xPos, yPos);
    points.push(newPoint); // Use push for adding to an array in JavaScript
    return newPoint;
}

function addSegment(point1, point2) {
    let newSegment = new Segment(point1, point2);
    segments.push(newSegment); // Use push for adding to an array in JavaScript
    return newSegment;
}

function setup() {
    createCanvas(1000, window.innerHeight*0.9);
    rectMode(CORNERS);
    textSize(textS);
    resetGrid();
    lastMousex = width / 2;
    lastMousey = height / 2;
}

function resetGrid() {
    points = [];
    segments = [];

    let startX = 240;
    let startY = 170;
    let gridSize = 600;

    let row_size = gridSize * 1.1 / rows;
    let col_size = gridSize * 0.8 / cols;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let newPointIndex = x + y * cols;
            let y_inc = 0;
            let x_inc = 0;
            if (y < rows / 2) {
                y_inc = Math.pow(x - cols / 2 + 1, 2) / (8 * (y + 1));
            } else {
                y_inc = -Math.pow(x - cols / 2 + 1, 2) / (8 * (rows - y)) + 1.5;
            }
            if (x < cols / 2) {
                x_inc = -Math.pow(y - rows / 2, 2) / (8 * (x + 1));
            } else {
                x_inc = Math.pow(y - rows / 2, 2) / (8 * (cols - x));
            }
            addPoint(newPointIndex, startX + x_inc + x * col_size, startY - y_inc + y * row_size);

            if ((y === 0 && x < 1) || (y === 0 && x > cols - 2) || (y === rows - 1 && x < 1) || (y === rows - 1 && x > cols - 2)) {
                points[newPointIndex].snap = true; // Snap points in the first and last rows
            } else if (y !== 0) {
                addSegment(points[points.length - cols - 1], points[newPointIndex]);

                if ((x + 1) % cols !== 1) { // Add a segment for triangulation
                    addSegment(points[points.length - cols - 2], points[newPointIndex]);
                }

            }
            if ((x + 1) % cols !== 1 && x > 0) { // Attach a segment to the left
                addSegment(points[points.length - 2], points[newPointIndex]);
            }
        }
    }
}


function draw() {
    background(255);
    fill(0);
    text("Click and Drag.", width/2-80, 80);
    // Simulation steps for points and segments
    points.forEach(p => p.sim());

    for (let timestep = 0; timestep < 3; timestep++) {
        segments.forEach(s => s.sim());
        points.forEach(p => p.collideToWindow());
    }
    if (mouseIsPressed) {
        fill(0, 200);
    } else {
        fill(0, 120);
    }
    noStroke();
    points.forEach(p => p.draw());

    if (mouseIsPressed) {
        let wind = createVector(0, 0);
        if (mouseX - lastMousex < 0) {
            wind.x = -0.15;
        } else if (mouseX - lastMousex > 0) {
            wind.x = 0.15;
        }
        if (mouseY - lastMousey < 0) {
            wind.y = 0.15;
        } else if (mouseY - lastMousey > 0) {
            wind.y = -0.15;
        }

        let oppoWind = createVector(-wind.x, -wind.y);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let index = x + y * cols;
                if (x < cols / 2) {
                    points[index].applyForce(wind);
                } else {
                    points[index].applyForce(oppoWind);
                }
            }
        }
    }
    lastMousex = mouseX;
    lastMousey = mouseY;
}