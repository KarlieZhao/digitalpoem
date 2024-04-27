function updatePoints() {
    for (let i = 0; i < pointArray.length; i++) {
      let point = pointArray[i];
      let beforeUpdateX = point.x;
      let beforeUpdateY = point.y;
  
      if (!point.locked) {
        let pX = point.prevX;
        let pY = point.prevY;
        let vx = point.x - pX;
        let vy = point.y - pY;
  
        point.x += vx;
        point.y += vy;
        point.y += 0.5 * grav * sq(frameRate()); // Assuming grav is defined, using frameRate() for deltaTime
      }
      point.prevX = beforeUpdateX;
      point.prevY = beforeUpdateY;
    }
    collision(); // Make sure this function is adapted too
  }
  
  function updateSticks() {
    for (let i = 0; i < stickArray.length; i++) {
      let stick = stickArray[i];
      let a = createVector(stick.a.x, stick.a.y);
      let b = createVector(stick.b.x, stick.b.y);
      let stickCenter = p5.Vector.div(p5.Vector.add(a, b), 2);
      let stickDir = p5.Vector.sub(a, b).normalize();
  
      if (!stick.a.locked) {
        let updatedPos = p5.Vector.add(stickCenter, p5.Vector.mult(stickDir, stick.length / 2)); // Move to the right length for the stick
        stick.a.x = updatedPos.x;
        stick.a.y = updatedPos.y;
      }
      if (!stick.b.locked) {
        let updatedPos = p5.Vector.sub(stickCenter, p5.Vector.mult(stickDir, stick.length / 2)); // Move to the right length for the stick
        stick.b.x = updatedPos.x;
        stick.b.y = updatedPos.y;
      }
    }
  }
  