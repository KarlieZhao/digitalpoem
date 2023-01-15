let scl = 80;
let noise_inc = 0.1;
let flowfield = [];
let cols;
let zoff = 0;

function createFlowField() {
  let xoff = 0;
  cols = floor(width / scl);
  stroke(255);
  for (let y = 2; y < height / scl; y++) {
    let yoff = 0;
    for (let x = 0; x < width / scl; x++) {
      let index = x + y * cols;
      let r = noise(xoff, yoff, zoff) * TWO_PI * 2;
      let flowVector = p5.Vector.fromAngle(r);
      flowfield[index] = flowVector.setMag(0.01);
      xoff += noise_inc;

      //debug
      // push();
      // translate(x * scl, y * scl);
      // rotate(flowVector.heading());
      // line(0, 0, scl, 0);
      // pop();
    }
    yoff += noise_inc;
  }
  zoff += 0.003;

}
